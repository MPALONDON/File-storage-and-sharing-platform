import {useState} from "react";

export default function VideoLikeButton({ video, setVideo }){

    const currentUserId = video.user?.id;

    const hasLiked = video.likes?.some(like => like.user_id === currentUserId);

        async function addLike(){

      const response = await fetch("http://localhost:8000/add-like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
          credentials: "include",
          body:JSON.stringify({video_id:video.id})
      }

    )
      const data = await response.json()
                if(response.status === 409){
                    console.log("error")


            }
        setVideo(prev => ({
      ...prev,
      likes: data.likes,
            message: data.message,
            user:data.user

    }));

  }

    return(
        <button className={hasLiked ? "like_button active_like" : "like_button inactive_like"} onClick={addLike}>
            <span>👍 {video.likes?.length}</span>
        </button>
        )
}