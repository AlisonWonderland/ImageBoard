import DOMPurify from 'dompurify'

const PostText = ({ text }) => {
    // first figure out how to show newlines
    // const test = '<a href="#1"> >>12 </a>'
    return (
        <blockquote className="postMessage" cite="">
            {/* <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(test)}}></div> */}
            {text}
        </blockquote>
    )
}

export default PostText