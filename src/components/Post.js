import React, { useState } from 'react'

const Post = ({ post }) => {
    const [ showForm, setShowForm ] = useState(false)

    const formatDate = (date) => {
        let localDate = new Date(date).toLocaleDateString(undefined, {
            month:'numeric', 
            day:'numeric',
            year: '2-digit', 
            weekday:'short', 
            hour:'numeric', 
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        })

        localDate = localDate.replace(/\s/g, '');
        return localDate
    }

    const handleReplyClick = (e) => {
        e.preventDefault()
        setShowForm(!showForm)
    }

    const media = post.filetype === "image"
        ?   <img className="thumbnail" src={post.thumbnailURL} alt="img" />
        :   <video width="320" height="240" controls>
                <source src={post.url} type="video/webm" />
                Your browser does not support the video tag.
            </video>

    return (
        <div id={post.id} className="postContainer replyContainer">
            <div className="sideArrows">&gt;&gt;</div>
            <div className="post reply">
                <div className="postInfo">
                    <span className="nameBlock">Anonymous&nbsp;</span> 
                    {formatDate(post.date)}  
                    <span className="postNum"><a href={`#${post.id}`}> No. </a><a href={`#${post.id}`} onClick={handleReplyClick}>{post.id}</a> &nbsp;</span> 
                    [<a href="posturl">Reply</a>] &gt; 
                    {/* replies */}
                    <a href="#thread"> &gt;&gt;010010101</a>
                </div>
                <div className="file">
                    <div className="fileInfo">
                            File: <a href={post.url} target="_blank" rel="noreferrer">{post.filename}</a> ({post.dimensions.width}x{post.dimensions.height})
                        </div>
                        <a href={post.url}>
                            {media}
                        </a>
                    </div>
                <blockquote className="postMessage" cite="https://www.huxley.net/bnw/four.html">
                    {}
                </blockquote>
            </div>
        </div>
    )
}

export default Post