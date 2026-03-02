from datetime import datetime
from pydantic import BaseModel,Field


class UserPost(BaseModel):
    first_name:str = Field(...)
    surname:str = Field(...)
    username:str = Field(...)
    email:str = Field(...)
    password:str = Field(...)

class UserLogin(BaseModel):
    email: str = Field(...)
    password:str = Field(...)

class UserExists(BaseModel):
    username:str = Field(...)
    email:str = Field(...)

class GetUsername(BaseModel):
    username:str

class GetUser(BaseModel):
    username:str

class AllVideos(BaseModel):
    id:int
    url:str
    title:str
    description:str
    views:int
    uploaded_by:int
    thumbnail:str
    uploaded_at: datetime
    uploader: GetUsername

class VideoLikes(BaseModel):
    user_id:int

class FindVideo(AllVideos):
    id:int
    likes:list[VideoLikes]
    comments:list[GetComments]

class LikeRequest(BaseModel):
    video_id: int

class ProcessView(BaseModel):
    id:int = Field(...)

class AddComment(BaseModel):
    text:str = Field(...)
    video_id:int = Field(...)

class GetComments(BaseModel):
    id:int
    text: str
    author_id: int
    comment_author: GetUser
    created_at: datetime

class DeleteComment(BaseModel):
    id: int = Field(...)