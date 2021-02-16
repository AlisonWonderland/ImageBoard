import React, { useState } from 'react'
import File from './File'
import PostText from './PostText'
import PostInfo from './PostInfo'

const Post = ({ post }) => {
    const [ showForm, setShowForm ] = useState(false)

    const fileElement = post.url === undefined ?
        <></>
        :   <File url={post.url} filename={post.filename} dimensions={post.dimensions} thumbnailURL={post.thumbnail125URL} filetype={post.filetype}></File>

    // add reply form here
    return (
        <div id={post.id} className="postContainer replyContainer">
            <div className="sideArrows">&gt;&gt;</div>
            <div className="post reply">
                <PostInfo date={post.date} postNum={post.postNum} showForm={showForm} setShowForm={setShowForm}></PostInfo>
                {fileElement}
                <PostText text={post.text}></PostText>
            </div>
        </div>
    )
}

export default Post