import {
    Link
} from "react-router-dom";

const MiniThreads = ({ thread }) => {
    
    return (
        <div className="miniThread">
            <Link to={`/thread/${thread.post_num}`}>
                <img src={thread.thumbnail125URL} alt="125 pixel thumbnail"></img>
            </Link>
            <div>Comments: {thread.num_comments} | Images: {thread.num_images}</div>
            <div className="textPreview">{thread.post_text}</div>
        </div>
    )
}

export default MiniThreads