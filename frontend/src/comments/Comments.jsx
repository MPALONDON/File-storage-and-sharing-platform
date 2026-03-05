import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';

export default function Comments({video}){
    const [commentData, setCommentData] = useState([])
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null)
    const [inputClick,setInputClick] = useState(false)
    const [currentComment, setCurrentComment] = useState("")

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
        setCurrentComment("");
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
            <h1>{commentData.length} Comments</h1>
            <form onSubmit={(event)=>addComment(event)}>
                <label>
                    <input className={inputClick? "comment_input active" : "comment_input"} name="comment_input"
                           placeholder="Add a comment..." onClick={()=>setInputClick(true)}
                            onChange={(e)=>setCurrentComment(e.target.value)}
                            value={currentComment}/>
                </label>
                {inputClick &&
                    <div className="comment-btns-container-flex">
                        <div className="comment-btns-container">
                            <button className="btn cancel" type="button" onClick={()=>{setInputClick(false);
                                                                                    setCurrentComment("")}}>Cancel</button>
                            <button className={currentComment===""? "btn inactive" : "btn"} disabled={currentComment===""} type="submit">Comment</button>
                        </div>
                    </div>}
            </form>


            <div>
                {commentData.map((comment) => (
                    <div className="comment-container" key={comment.id}>
                        <li>
                            <div className="author-header">
                            <p className="user-handle" onClick={()=>navigate(`/${comment.comment_author.username}`)}>
                                @{comment.comment_author.username}
                            </p>
                            <p className="comment-time">

                               {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </p>
                                {comment.comment_author.username === currentUser?
                                <button className="btn delete-comment" onClick={(event)=>handleDelete(event,comment)}>
                              Delete
                            </button>
                            :
                            undefined}
                                </div>
                            <p>
                            {comment.text}
                                </p>



                        </li>
                    </div>

                ))}

            </div>

        </div>
    )
}