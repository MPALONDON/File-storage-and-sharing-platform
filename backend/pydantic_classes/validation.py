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

class VideoCreate(BaseModel):
    title:str = Field(...)
    description:str = Field(...)

class GetUser(BaseModel):
    username:str

class GetId(BaseModel):
    id:int

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
    likes:list[VideoLikes]

class LikeRequest(BaseModel):
    video_id: int
