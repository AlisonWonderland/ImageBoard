import {
    Link
} from "react-router-dom";

const MiniThreads = ({ thread }) => {
    
    return (
        <div className="miniThread">
            <Link to={`/thread/${thread.postNum}`}>
                <img src={thread.thumbnail125URL} alt="125 pixel thumbnail"></img>
            </Link>
            <div>C: {thread.numComments} | I: {thread.numImages}</div>
            <div className="textPreview">{thread.text}</div>
        </div>
    )
}

export default MiniThreads