import React, { useState } from 'react'
import useWindowDimensions from './hooks/windowDimension'

const Post = ({ post }) => {
    const [ showForm, setShowForm ] = useState(false)
    const [ showThumbnail, setShowThumbnail ] = useState(true)
    const [ showFullSize, setShowFullSize ] = useState(false)
    const { windowHeight, windowWidth } = useWindowDimensions();

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

    const handleThumbnailClick = (e) => {
        e.preventDefault()

        if(post.filetype === "video") {
            setShowThumbnail(false)
            setShowFullSize(true)
        }
        else {
            setShowThumbnail(!showThumbnail)
            setShowFullSize(!showFullSize)
        }
    }

    const getMaxDimensions = (dimensions) => {
        const aspectRatio = dimensions.width / dimensions.height
        const maxWidth = windowWidth - 70
        let maxHeight = 0

        // console.log('dim width:', dimensions.width)
        // console.log('dim height:', dimensions.height)
        // console.log('win width:', windowWidth)
        // console.log('win height:', windowHeight)


        if(dimensions.width <= maxWidth)
            maxHeight = dimensions.height
        else
            maxHeight = maxHeight / aspectRatio

        // console.log('ratio:', aspectRatio)
        // console.log('width:', maxWidth)
        // console.log('height:', maxHeight)

        return { maxWidth, maxHeight }
    }


    let fullSizeContent = null

    if(showFullSize)
        if(post.filetype === "image")
            fullSizeContent = <img className="thumbnail-exp" src={post.url} alt="" style={getMaxDimensions(post.dimensions)}></img>
        else
            fullSizeContent =   <video controls loop autoPlay muted className="vid-exp">
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
                        <a href={post.url} onClick={handleThumbnailClick}>
                            <img className="thumbnail" src={post.thumbnailURL} alt=""style={{display: showThumbnail ? "": "none"}} />
                            {fullSizeContent}
                        </a>
                </div>
                <blockquote className="postMessage" cite="https://www.huxley.net/bnw/four.html">
                    {post.replyText}
                </blockquote>
            </div>
        </div>
    )
}

export default Post