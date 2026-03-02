import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {formatDistanceToNow} from "date-fns";

export default function Home(){
    const [videos,setVideos] = useState([])
    const [durations, setDurations] = useState({})

    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search_query");
    console.log(searchQuery)
    console.log(queryParams)
    console.log(location)


    useEffect(()=>{
        const fetchData = async ()=>{
            let endpoint = searchQuery!== null ? `?search_query=${searchQuery}` : ""
        const response = await fetch(`http://localhost:8000/all/videos${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }}
    )
        const data = await response.json()
            setVideos(data)

    };
    fetchData()
    },[searchQuery])

    const handleLoadedMetadata = (id, event) => {
    setDurations((prev) => ({
      ...prev,
      [id]: event.target.duration,
    }));
  };
    const formatTime = (seconds) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

    return (

  <div className="container_videos">

  {videos.map((video) => (
      <div key={video.url} onClick={() => navigate(`watch?v=${video.id}`)}>
        <li
        style={{ cursor: "pointer" }}
    >
        <div className="video-wrapper">
        <video className="video-thumb"
             controlsList="nodownload"
               preload="metadata"
                onLoadedMetadata={(e) => handleLoadedMetadata(video.id, e)}

            poster={video.thumbnail}
      >
        <source src={video.url} type="video/mp4" />
        </video>
        </div>

      <h3>{video.title}</h3>
            <p>{formatTime(durations[video.id])}</p>

      <p className="video_uploader_link"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/${video.uploader.username}`);
        }}
      >
        {video.uploader.username}
      </p>
        <div className="views_upload-date">
            <p>{video.views} views</p>
            <span className="seperator"></span>
            <p>{formatDistanceToNow(video.uploaded_at, { addSuffix: true })}</p>
        </div>
    </li>
          </div>
  ))}
</div>
);


}