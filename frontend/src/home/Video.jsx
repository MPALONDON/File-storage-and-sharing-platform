import {useEffect, useState, useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import VideoLikeButton from "../home/VideoLikeButton.jsx"
import { hasWatchedThreshold } from "./video logic.js";
import SideVideos from "../sidevideos/SideVideos.jsx";
import Header from "../header/Header.jsx";
import Comments from "../comments/Comments.jsx";
import VideoDislikeButton from "./VideoDislikeButton.jsx";
import {formatDistanceToNow} from "date-fns";


export default function Video(){
    const [video, setVideo] = useState({})
    const [currentWatchTime, setWatchTime] = useState(false)
    const [videos, setVideos] = useState([])



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
      method: "PATCH",
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
        const response = await fetch(`http://localhost:8000/video?id=${v}`, {
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

    useEffect(()=>{
        const fetchData = async ()=>{
        const response = await fetch(`http://localhost:8000/all/videos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }}
    )
        const data = await response.json()
            setVideos(data)

    };
    fetchData()
    },[])

    return(<>
        <Header sidebar = "icon1" homepage="YouTube" signin= "Sign In" signout="Sign-out" userAccount="My account">

        </Header>
        <div className="full-video-container">
            <div className="left-container">

                <video className="video_player" ref={videoRef}
                    key={video.url}
                poster={video.thumbnail}
                controls
                       controlsList="nodownload"
                       onTimeUpdate={currentWatchTime ? undefined : handlePlay}
                onClick={(e) => e.stopPropagation()}
              >
                    <source src={video.url} type="video/mp4" />
                </video>

                  <h1>{video.title}</h1>

                <div className="user__likes">

                <p className= "left__uploaded_by"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/${video.uploader?.username}`);
                    }}
                  >
                    {video.uploader?.username}
                  </p>

                    <div className="like_dislike">
                    <VideoLikeButton video={video} setVideo={setVideo}>

                    </VideoLikeButton>

                    <VideoDislikeButton>

                    </VideoDislikeButton>
                    </div>
                </div>
                    <div className="video-details">
                        <p>{video.views} views</p>

                        <p>{video.uploaded_at &&
                            formatDistanceToNow(new Date(video.uploaded_at), { addSuffix: true })}</p>
                        <p>{video.description}</p>


                    </div>

                    <div className="comments">
                        <Comments video= {video}>

                        </Comments>
                    </div>



            </div>
            <SideVideos videos={videos}>

            </SideVideos>

            </div>

        </>
    )
}