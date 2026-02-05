import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import VideoLikeButton from "../home/VideoLikeButton.jsx"

export default function Video(){
    const [video, setVideo] = useState({})
    const [likesCount, setLikesCount] = useState(0)

    const token = localStorage.getItem("token")

    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const v = queryParams.get("v");


    useEffect(()=>{
        const fetchData = async ()=>{
        const response = await fetch(`http://127.0.0.1:8000/video?id=${v}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }}
    )
        const data = await response.json()
            setVideo(data)

    };
    fetchData()
    },[])


    return(
        <div>
        <video
            key={video.url}
        width="470"
        height="255"
        poster={video.thumbnail}
        controls
        onClick={(e) => e.stopPropagation()}
      >
        <source src={video.url} type="video/mp4" />
      </video>

      <h3>{video.title}</h3>
      <p>{video.description}</p>

      <p
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/${video.uploader?.username}`);
        }}
        style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
      >
        {video.uploader?.username}
      </p>

      <p>{video.views} views</p>
            <VideoLikeButton video={video}>

            </VideoLikeButton>

            </div>
    )
}