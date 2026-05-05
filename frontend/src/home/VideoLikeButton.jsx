import {useNavigate} from "react-router-dom";
import LikeSvg from "../assets/LikeSVG.jsx";

export default function VideoLikeButton({ video, setVideo, currentUser }){

    const hasLiked = video.likes?.some(like => like.user_id === currentUser)

    const navigate = useNavigate();

    async function addLike(){
        const response = await fetch("http://localhost:8000/process-like", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({video_id: video.id})
        })

        const data = await response.json()

        if(response.status === 401){
            navigate("/sign-in")
        }

        if(hasLiked){
            setVideo(prev => ({
                ...prev,
                likes: prev.likes.filter(like => like.user_id !== currentUser),
                likes_count: data.likes
            }))
        } else {
            setVideo(prev => ({
                ...prev,
                likes: [...prev.likes, { user_id: currentUser }],
                likes_count: data.likes
            }))
        }
    }

    return(
        <button title="Like"
            className={hasLiked ? "like_button active_like" : "like_button inactive_like"}
            onClick={addLike}
        >
            <span><LikeSvg></LikeSvg> {video.likes_count === null ? 0 : video.likes_count}</span>
        </button>
    )
}