import DOMPurify from 'dompurify'

const PostText = ({ text }) => {
    console.log('text', text)
    const regex = />>(?<parentNum>\d+)/gm
    const test = text.replace(regex, '<a href="#$<parentNum>">$&</a>')

    return (
        <blockquote dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(test)}} className="postMessage" cite="">
        </blockquote>
    )
}

export default PostText