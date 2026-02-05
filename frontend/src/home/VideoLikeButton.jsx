import {useState} from "react";

export default function VideoLikeButton({ video }){
        const [currentLikes,setLikes] = useState(null)

        async function addLike(){

      const response = await fetch("http://127.0.0.1:8000/add-like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },body:JSON.stringify({video_id:video.id})
      }

    )
      const data = await response.json()
        setLikes(data);

  }

    return(

        <button onClick={addLike}>
            <span>{video.likes?.length ?? 0}  👍</span>
        </button>
        )
}