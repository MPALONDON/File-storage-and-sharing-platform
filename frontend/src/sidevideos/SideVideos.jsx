
export default function SideVideos({videos}){
    return (
        <div className="right-container">
                 {videos.map((video) => (
                  <div key={video.url} onClick={() => window.location.href = `/watch?v=${video.id}`}>
                    <li className="video-item"
                      style={{ cursor: "pointer" }}
                    >
                        <div className="sidebar-video-wrapper">
                      <video className="video-thumb"
                             controlsList="nodownload"



                        poster={video.thumbnail}
                      >
                        <source src={video.url} type="video/mp4" />
                      </video>
                        </div>
                        <div className="video-info">
                      <h3>{video.title}</h3>

                      <p className="video_uploader_link"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/${video.uploader.username}`);
                        }}
                      >
                        {video.uploader.username}
                      </p>

                      <p>{video.views} views</p>
                            </div>
                    </li>
          </div>
  ))}

            </div>)
}