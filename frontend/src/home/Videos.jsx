import {use, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Home(){
    const [videos,setVideos] = useState([])

    const navigate = useNavigate();



    useEffect(()=>{
        const fetchData = async ()=>{
        const response = await fetch("http://127.0.0.1:8000/all/videos", {
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

    return (

  <div className="container_videos">

  {videos.map((video) => (
    <li
      key={video.url}
      onClick={() => navigate(`watch?v=${video.id}`)}
      style={{ cursor: "pointer" }}
    >
        <div className="video-wrapper">
      <video className="video-thumb"


        poster={video.thumbnail}
        controls
        onClick={(e) => e.stopPropagation()}
      >
        <source src={video.url} type="video/mp4" />
      </video>
        </div>

      <h3>{video.title}</h3>
      <p>{video.description}</p>

      <p
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/${video.uploader.username}`);
        }}
        style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
      >
        {video.uploader.username}
      </p>

      <p>{video.views} views</p>
    </li>
  ))}
</div>
);


}