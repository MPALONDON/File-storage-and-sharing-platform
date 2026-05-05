import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import CommentLike from "./CommentLike.jsx";
import CommentDislike from "./CommentDislike.jsx";
import CommentReply from "./CommentReply.jsx";

export default function Comments({video,videoID}){
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

    const handleSort = async (e)=>{
        const video_id = {video_id : videoID}
        const searchParams = new URLSearchParams(video_id);
        searchParams.append("sort_by",e.target.value)
        const queryString = searchParams.toString()
        console.log(queryString)
        const response = await fetch(`http://localhost:8000/sort-comments?${queryString}`,{
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            },
            credentials: "include",
        })

        const data = await response.json()
        if(!response.ok){
            throw(response.status)
        }
        setCommentData(data)
    }

    return(
        <div>
            <div className="Comment-filter-row">
                <h1>{commentData.length} Comments</h1>
                <select title="Sort Comments" onChange={(e)=>handleSort(e)} className="comment-sortBy" name="sortBy">
                    <option value="Newest">Newest</option>
                    <option value="Top">Top Comments</option>

                </select>
            </div>
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
                            <div className="comment-engagement-bar">
                                <CommentLike>
                                </CommentLike>

                                <CommentDislike>
                                </CommentDislike>

                                <CommentReply>
                                </CommentReply>
                            </div>



                        </li>
                    </div>

                ))}

            </div>

        </div>
    )
}