import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';

export default function Comments({video}){
    const [commentData, setCommentData] = useState([])
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null)
    console.log(currentUser)

    useEffect(() => {
        if (video.comments) {
        setCommentData(video.comments);
        }
            }, [video]);

    useEffect(()=>{
        const fetchData = async ()=>{
            const response = await fetch("http://localhost:8000/username", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
            credentials : "include",}
    )
        const data = await response.json()
            setCurrentUser(data.username)

    };
    fetchData()
    },[])


    const addComment = async (event) =>{
        event.preventDefault();
        const formData = new FormData(event.target);
        const comment = formData.get("comment_input")
        event.target.reset();
        const response = await fetch("http://localhost:8000/add-comment",{
                 method: "POST",
                headers: {
                "Content-Type": "application/json",
      },
            credentials : "include",

                body:JSON.stringify({text:comment,
                                            video_id:video.id})
        })

        const data = await response.json()
        setCommentData((prevState)=> [data,...prevState]
        )
    }

    const handleDelete = async (event,comment) =>{
        const response = await fetch(`http://localhost:8000/delete-comment`,{
            method: "DELETE",
                headers: {
                "Content-Type": "application/json",
      },
            credentials : "include",
            body:JSON.stringify({id:comment.id})
        })
        setCommentData(prev => prev.filter(c => c.id !== comment.id));
    }

    return(
        <div>
            <h1>Comments</h1>
            <form onSubmit={(event)=>addComment(event)}>
                <label>
                    <input name="comment_input" placeholder="Add a comment..."/>
                </label>
            </form>

            <div>
                {commentData.map((comment) => (
                    <div className="comment-container" key={comment.id}>
                        <li>
                            <p className="user-handle" onClick={()=>navigate(`/${comment.comment_author.username}`)}>
                                @{comment.comment_author.username}
                            </p>
                            <p className="comment-time">

                               {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </p>
                            {comment.text}

                            {comment.comment_author.username === currentUser?
                                <button className="btn delete-comment" onClick={(event)=>handleDelete(event,comment)}>
                              Delete
                            </button>
                            :
                            undefined}

                        </li>
                    </div>

                ))}

            </div>

        </div>
    )
}