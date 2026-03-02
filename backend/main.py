from uuid import UUID

from fastapi import FastAPI,Depends,HTTPException,status,File,UploadFile,Form,Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi_login import LoginManager
from pathlib import Path
import sqlalchemy
from sqlalchemy import create_engine,String,Integer,ForeignKey,UUID,Text,DateTime,select,or_
from sqlalchemy.orm import DeclarativeBase, Mapped,mapped_column,relationship, Session
import uuid
from datetime import datetime
from werkzeug.security import generate_password_hash,check_password_hash
import uvicorn
import os
from dotenv import load_dotenv

from backend.imagekit_client import upload_video,upload_thumbnail

from backend.pydantic_classes.validation import UserExists
from backend.pydantic_classes.validation import UserLogin
from backend.pydantic_classes.validation import UserPost
from backend.pydantic_classes.validation import GetUsername
from backend.pydantic_classes.validation import AllVideos
from backend.pydantic_classes.validation import FindVideo
from backend.pydantic_classes.validation import LikeRequest
from backend.pydantic_classes.validation import ProcessView
from backend.pydantic_classes.validation import AddComment
from backend.pydantic_classes.validation import GetComments
from backend.pydantic_classes.validation import DeleteComment

db_folder = Path.cwd() / "instance"
db_folder.mkdir(exist_ok=True)

DB_path = db_folder / "database.db"

engine = create_engine(f"sqlite:///{DB_path}",echo=True)

app = FastAPI()


origins = [
    "http://localhost:5173/",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Base(DeclarativeBase):
    pass

def format_date(date:datetime):
    return date.strftime("%d/%m/%y %H:%M")

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer,primary_key=True)
    first_name: Mapped[str] = mapped_column(String(64))
    surname: Mapped[str] = mapped_column(String(64))
    username: Mapped[str] = mapped_column(String(64), unique=True)
    email: Mapped[str] = mapped_column(String(64), unique=True)
    password: Mapped[str] = mapped_column(String(256))
    date_created: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    videos: Mapped[list[Video]] = relationship("Video", back_populates="uploader")
    comments: Mapped[list[Comment]] = relationship("Comment", back_populates="comment_author")

    video_likes: Mapped[list[VideoLike]] = relationship(
        "VideoLike",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    comment_likes: Mapped[list[CommentLike]] = relationship(
        "CommentLike",
        back_populates="user",
        cascade="all, delete-orphan",
    )


class Video(Base):
    __tablename__ = "videos"

    id: Mapped[int] = mapped_column(Integer,primary_key=True)
    url:Mapped[str] = mapped_column(String(128),nullable=True)
    title: Mapped[str] = mapped_column(String(128))
    description: Mapped[str] = mapped_column(String(128))
    views: Mapped[int] = mapped_column(Integer, default=0)

    uploaded_by: Mapped[int] = mapped_column(ForeignKey("users.id"))
    thumbnail: Mapped[str] = mapped_column(String(256),nullable=True)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    uploader: Mapped[User] = relationship("User", back_populates="videos")
    comments: Mapped[list[Comment]] = relationship("Comment", back_populates="video")

    likes: Mapped[list[VideoLike]] = relationship(
        "VideoLike",
        back_populates="video",
        cascade="all, delete-orphan",
    )

    @property
    def likes_count(self) -> int:
        return len(self.likes)


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer,primary_key=True)
    text: Mapped[str] = mapped_column(Text, nullable=False)

    video_id: Mapped[int] = mapped_column(ForeignKey("videos.id"))
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    video: Mapped[Video] = relationship("Video", back_populates="comments")
    comment_author: Mapped[User] = relationship("User", back_populates="comments")

    likes: Mapped[list[CommentLike]] = relationship(
        "CommentLike",
        back_populates="comment",
        cascade="all, delete-orphan",
    )

    @property
    def likes_count(self) -> int:
        return len(self.likes)


class VideoLike(Base):
    __tablename__ = "video_likes"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    video_id: Mapped[int] = mapped_column(ForeignKey("videos.id"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    user: Mapped[User] = relationship("User", back_populates="video_likes")
    video: Mapped[Video] = relationship("Video", back_populates="likes")


class CommentLike(Base):
    __tablename__ = "comment_likes"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    comment_id: Mapped[int] = mapped_column(ForeignKey("comments.id"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    user: Mapped[User] = relationship("User", back_populates="comment_likes")
    comment: Mapped[Comment] = relationship("Comment", back_populates="likes")


Base.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

@app.post("/register")
def register(user:UserPost,session:Session = Depends(get_session)):
    encrypted_password = generate_password_hash(user.password,salt_length=15)
    user = User(first_name=user.first_name,surname=user.surname,email=user.email,password=encrypted_password,username=user.username)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.post("/check-user")
def user_exists(user:UserExists, session:Session = Depends(get_session)):
    username_exists = session.execute(select(User).where(User.username == user.username)).scalar_one_or_none() is not None
    email_exists = session.execute(select(User).where(User.email == user.email)).scalar_one_or_none() is not None

    if username_exists or email_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "username": username_exists,
                "email": email_exists,
            },
        )
    return {"user_exists":"False"}

load_dotenv()

manager = LoginManager(os.getenv("SECRET_KEY"), token_url="/login", use_cookie=True,use_header=False)

@manager.user_loader()
def get_user_id(user_id:str):
    with Session(engine) as session:
        return session.get(User, int(user_id))
@app.post("/login")
def login(response:Response,user:UserLogin,session:Session = Depends(get_session)):
    database_user = session.execute(select(User).where(User.email == user.email)).scalar_one_or_none()
    if not database_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    password_ok = check_password_hash(database_user.password,user.password)

    if not password_ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
        )
    access_token = manager.create_access_token(data={"sub": str(database_user.id)})
    print(access_token)
    manager.set_cookie(response,access_token)
    response.status_code = status.HTTP_200_OK
    return response

@app.get("/username",response_model=GetUsername)
def get_user(user=Depends(manager)):
    return user

@app.get("/logout")
def get_user(response:Response):
    response.delete_cookie(key="access-token")
    return {"status":"logged-out"}


@app.post("/user/upload-file")
async def upload_file(title: str = Form(...),description: str = Form(...),file: UploadFile = File(...),
                      thumbnail: UploadFile = File(...),
                      user=Depends(manager), session:Session = Depends(get_session)):

    db_user = session.get(User, user.id)
    video = Video(title=title,description=description,uploaded_by=user.id)
    db_user.videos.append(video)
    session.add(video)
    session.flush()

    folder = f"videos/{user.id}/{video.id}"

    video_data = await file.read()
    video_response = upload_video(file_data=video_data,
                 file_name=title,
                 folder=folder)

    thumbnail = await thumbnail.read()
    thumbnail_response = upload_thumbnail(file_data=thumbnail,
                     file_name=title,
                     folder=folder)
    video.url = video_response["url"]
    video.thumbnail = thumbnail_response["url"]
    session.commit()

    return {
        "message": "Upload successful",
        "filename": file.filename
    }

@app.post("/add-like")
def add_like(request: LikeRequest, user=Depends(manager), session:Session = Depends(get_session)):
    video = session.execute(select(Video).where(Video.id==request.video_id)).scalar_one_or_none()
    for like in video.likes:
        if like.user_id == user.id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="already liked",
            )
    new_like = VideoLike(user_id=user.id, video_id=request.video_id)
    video.likes.append(new_like)

    session.add(new_like)
    session.commit()
    print(len(video.likes))
    return {"message": "Video liked successfully", "likes": video.likes,"user": user}

@app.get("/all/videos",response_model=list[AllVideos])
def get_all_videos(search_query:str | None=None,session:Session = Depends(get_session)):
    if search_query:
        search = f"%{search_query}%"

        videos = session.execute(select(Video).join(Video.uploader, isouter=True).where(
            (Video.title.ilike(search) | Video.description.ilike(search) | User.username.ilike(search)
            )
        )).scalars().all()
        return videos

    videos = session.execute(select(Video)).scalars().all()
    if not videos:
        raise HTTPException(404,"no videos found")
    return videos

@app.get("/video",response_model=FindVideo)
def get_video(id:int,session:Session = Depends(get_session)):
    video = session.execute(select(Video).where(Video.id == id)).scalar_one_or_none()
    video.comments.sort(reverse=True,key=lambda c: c.created_at)
    return video

@app.patch("/process-view")
def process_view(video:ProcessView,session:Session = Depends(get_session)):
    video = session.execute(select(Video).where(Video.id == video.id)).scalar_one_or_none()
    video.views += 1
    session.commit()
    session.refresh(video)
    return video

@app.post("/add-comment",response_model=GetComments)
def add_comment(comment:AddComment ,user = Depends(manager),session:Session = Depends(get_session)):
    comment = Comment(text=comment.text,video_id=comment.video_id,author_id=user.id)
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment

@app.delete("/delete-comment")
def delete_comment(comment:DeleteComment,user = Depends(manager),session:Session = Depends(get_session)):
    comment = session.execute(select(Comment).where(Comment.id==comment.id)).scalar_one_or_none()
    session.delete(comment)
    session.commit()
    return {"status":"deleted"}






if __name__ == "__main__":
    uvicorn.run(app,host="localhost")