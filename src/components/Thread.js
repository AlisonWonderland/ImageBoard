import React, { useState, useEffect } from 'react'
import ReplyForm from './ReplyForm'
import Posts from './Posts'
import File from './File'
import PostText from './PostText'
import PostInfo from './PostInfo'

// store replies here
const Thread = ({ thread }) => {
    const [ showForm, setShowForm ] = useState(false)
    const [ posts, setPosts ] = useState([])

    return (
        <>
            <div className="thread">
                {/* <ReplyForm posts={posts} setPosts={setPosts} threadID={thread.id} showForm={showForm} setShowForm={setShowForm}></ReplyForm> */}

                <div className="postContainer opContainer">
                    <div id={thread.postNum} className="post op">
                        <File url={thread.url} filename={thread.filename} dimensions={thread.dimensions} thumbnailURL={thread.thumbnail250URL} filetype={thread.filetype}></File>
                        <PostInfo date={thread.date} postNum={thread.postNum} showForm={showForm} setShowForm={setShowForm}></PostInfo>
                        <PostText text={thread.text}></PostText>
                    </div>
                </div>

                {/* <Posts posts={posts}></Posts> */}
            </div>
            <hr/>
        </>
    )
}

export default Thread;