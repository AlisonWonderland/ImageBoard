import DOMPurify from 'dompurify'

const PostText = ({ text }) => {
    // first figure out how to show newlines
    const regex = />>(?<parentNum>\d+)/gm
    const test = text.replace(regex, '<a href="#$<parentNum>">$&</a>')
    // const test = '<a href="#1"> >>12 </a>\n more text'
    return (
        <blockquote dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(test)}} className="postMessage" cite="">
            {/* <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(test)}}></div> */}
            {/* {text} */}
        </blockquote>
    )
}

export default PostText