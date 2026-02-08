import {useEffect, useState, useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import VideoLikeButton from "../home/VideoLikeButton.jsx"
import { hasWatchedThreshold } from "./video logic.js";
import Header from "../header/Header.jsx";


export default function Video(){
    const [video, setVideo] = useState({})
    const [currentWatchTime, setWatchTime] = useState(false)

    const videoRef = useRef(null)

    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const v = queryParams.get("v");

    const handlePlay = () => {
    if (hasWatchedThreshold(videoRef.current, 30)) {
    setWatchTime(true);
    console.log("watch time reached")

        const processLike = async () => {
        const response = await fetch("http://127.0.0.1:8000/process-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },body:JSON.stringify({id:video.id})
      }

    )
      const data = await response.json()

  }
  processLike()
    }
};


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


    return(<>
        <Header sidebar = "icon1" homepage="YouTube" signin= "Sign In" signout="Sign-out" userAccount="My account">

        </Header>
        <div>
        <video ref={videoRef}
            key={video.url}
        width="470"
        height="255"
        poster={video.thumbnail}
        controls
               onTimeUpdate={currentWatchTime ? undefined : handlePlay}
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
            <VideoLikeButton video={video} setVideo={setVideo}>

            </VideoLikeButton>

            </div>
        </>
    )
}