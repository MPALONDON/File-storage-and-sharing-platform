from uuid import UUID

from fastapi import FastAPI,Depends,HTTPException,status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel,Field
from pathlib import Path
import sqlalchemy
from sqlalchemy import create_engine,String,Integer,ForeignKey,UUID,Text,DateTime,select
from sqlalchemy.orm import DeclarativeBase, Mapped,mapped_column,relationship, Session
import uuid
from datetime import datetime
from werkzeug.security import generate_password_hash,check_password_hash
import uvicorn

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

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
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

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(128))
    description: Mapped[str] = mapped_column(String(128))
    views: Mapped[int] = mapped_column(Integer, default=0)

    uploaded_by: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    thumbnail: Mapped[str] = mapped_column(String(256))
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

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    text: Mapped[str] = mapped_column(Text, nullable=False)

    video_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("videos.id"))
    author_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
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

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), primary_key=True)
    video_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("videos.id"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    user: Mapped[User] = relationship("User", back_populates="video_likes")
    video: Mapped[Video] = relationship("Video", back_populates="likes")


class CommentLike(Base):
    __tablename__ = "comment_likes"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), primary_key=True)
    comment_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("comments.id"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    user: Mapped[User] = relationship("User", back_populates="comment_likes")
    comment: Mapped[Comment] = relationship("Comment", back_populates="likes")


Base.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

class UserPost(BaseModel):
    first_name:str = Field(...)
    surname:str = Field(...)
    username:str = Field(...)
    email:str = Field(...)
    password:str = Field(...)

class UserLogin(BaseModel):
    email: str = Field(...)
    password:str = Field(...)
@app.post("/register")
def register(user:UserPost,session:Session = Depends(get_session)):
    encrypted_password = generate_password_hash(user.password,salt_length=15)
    user = User(first_name=user.first_name,surname=user.surname,email=user.email,password=encrypted_password,username=user.username)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.post("/login")
def login(user:UserLogin,session:Session = Depends(get_session)):
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

    return {"message": "success"}




if __name__ == "__main__":
    uvicorn.run(app)