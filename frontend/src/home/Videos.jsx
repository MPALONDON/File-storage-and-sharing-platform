import {use, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

export default function Home(){
    const [videos,setVideos] = useState([])

    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search_query");
    console.log(searchQuery)



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



        poster={video.thumbnail}
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
          </div>
  ))}
</div>
);


}