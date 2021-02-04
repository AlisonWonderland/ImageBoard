import React, { useState, useEffect } from 'react'
import ReplyForm from './ReplyForm'
import Posts from './Posts'
import useWindowDimensions from './hooks/windowDimension'

// function getWindowDimensions() {
//   const { innerWidth: width, innerHeight: height } = window;
//   return {
//     width,
//     height
//   };
// }

// function useWindowDimensions() {
//   const [windowDimensions, setWindowDimensions] = useState(
//     getWindowDimensions()
//   );

//   console.log('useDim', windowDimensions)

//   useEffect(() => {
//     function handleResize() {
//       setWindowDimensions(getWindowDimensions());
//     }

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return windowDimensions;
// }

// store replies here
const Thread = ({ thread }) => {
    const [ showForm, setShowForm ] = useState(false)
    const [ posts, setPosts ] = useState([])
    const [ showThumbnail, setShowThumbnail ] = useState(true)
    const [ showFullSize, setShowFullSize ] = useState(false)
    const { windowHeight, windowWidth } = useWindowDimensions();

    // console.log('-----------')
    // console.log('win width:', windowWidth)
    // console.log('win height:', windowHeight)

    const formatDate = (threadDate) => {
        let localDate = new Date(threadDate).toLocaleDateString(undefined, {
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
        return localDate + ' '
    }

    const handleReplyClick = (e) => {
        e.preventDefault()
        setShowForm(!showForm)
    }

    const handleThumbnailClick = (e) => {
        e.preventDefault()

        if(thread.filetype === "video") {
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

    // should be a state
    let fullSizeContent = null

    if(showFullSize)
        if(thread.filetype === "image")
            fullSizeContent = <img className="thumbnail-exp" src={thread.url} alt="" style={getMaxDimensions(thread.dimensions)}></img>
        else
            fullSizeContent =   <video controls loop autoPlay muted className="vid-exp">
                                    <source src={thread.url} type="video/webm" />
                                    Your browser does not support the video tag.
                                </video>

    // implement logic for reply form
    return (
        <>
            <div className="thread">
                <ReplyForm posts={posts} setPosts={setPosts} threadID={thread.id} showForm={showForm} setShowForm={setShowForm}></ReplyForm>

                <div className="postContainer opContainer">
                    <div id={thread.id} className="post op">
                        <div className="file">
                            <div className="fileInfo">
                                File: <a href={thread.url} target="_blank" rel="noreferrer">{thread.filename}</a> ({thread.dimensions.width}x{thread.dimensions.height})
                            </div>
                            <a href={thread.url} onClick={handleThumbnailClick}>
                                <img className="thumbnail" src={thread.thumbnailURL} alt=""style={{display: showThumbnail ? "": "none"}} />
                                {fullSizeContent}
                            </a>
                        </div>
                        <div className="postInfo">
                            <strong>{thread.title} </strong> 
                            <span className="nameBlock"><strong> Anonymous&nbsp;</strong> </span> 
                            {formatDate(thread.date)} 
                            <span className="postNum"><a href={`#${thread.id}`}> No. </a><a href={`#${thread.id}`} onClick={handleReplyClick}>{thread.id}</a> &nbsp;</span> 
                            [<a href="posturl">Reply</a>] &gt; 
                            {/* replies */}
                            <a href="#thread"> &gt;&gt;010010101</a>
                        </div>
                        <blockquote className="postMessage" cite="https://www.huxley.net/bnw/four.html">
                            {thread.submissionText}
                        </blockquote>
                    </div>
                </div>

                <Posts posts={posts}></Posts>
            </div>
            <hr/>
        </>
    )
}

export default Thread;