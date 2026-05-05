import DislikeSvg from "../assets/DislikeSVG.jsx";

export default function VideoDislikeButton(){

    return(
        <button title="Dislike" className="dislike_button inactive_dislike">
            <span><DislikeSvg></DislikeSvg> 20</span>
        </button>
        )
}