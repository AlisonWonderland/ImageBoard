import React, { useState, useEffect } from 'react'
import File from './File'
import PostText from './PostText'
import PostInfo from './PostInfo'

import postService from '../services/post'

const Post = ({ post }) => {
    const [ showForm, setShowForm ] = useState(false)
    const [ replies, setReplies ] = useState([])

    const getRepliesHook = () => {
        const fetchReplies = async() => {
            const fetchReplies = await postService.getReplies(post.postNum, 'comment')
            const fetchedReplies = fetchReplies.data.map(reply => reply.postNum)
            
            // console.log('replies:', fetchedReplies)
            setReplies(fetchedReplies)
            // console.log('threads reset')
        }
        fetchReplies()
    }

    useEffect(getRepliesHook, [])

    const fileElement = post.url === undefined ?
        <></>
        :   <File url={post.url} filename={post.filename} dimensions={post.dimensions} thumbnailURL={post.thumbnail125URL} filetype={post.filetype}></File>

    // add reply form here
    return (
        <div id={post.postNum} className="postContainer replyContainer">
            <div className="sideArrows">&gt;&gt;</div>
            <div className="post reply">
                <PostInfo date={post.date} postNum={post.postNum} showForm={showForm} setShowForm={setShowForm} replies={replies}></PostInfo>
                {fileElement}
                <PostText text={post.text}></PostText>
            </div>
        </div>
    )
}

export default Post