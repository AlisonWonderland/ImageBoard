const PostText = ({ text }) => {
    return (
        <blockquote className="postMessage" cite="">
            {text}
        </blockquote>
    )
}

export default PostText