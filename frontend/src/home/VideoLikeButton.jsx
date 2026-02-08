import {useState} from "react";

export default function VideoLikeButton({ video, setVideo }){

        async function addLike(){

      const response = await fetch("http://127.0.0.1:8000/add-like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
          credentials: "include",
          body:JSON.stringify({video_id:video.id})
      }

    )
      const data = await response.json()
        setVideo(prev => ({
      ...prev,
      likes: data.likes,
            message: data.message

    }));

  }

    return(
        <button className={video.message? "like_button_active" : undefined} onClick={addLike}>
            <span>{video.likes?.length}  👍</span>
        </button>
        )
}