import React, { useState, useEffect } from 'react'
import ReplyForm from './ReplyForm'
import Posts from './Posts'
import File from './File'
import PostText from './PostText'
import PostInfo from './PostInfo'

import postService from '../services/post'

// store replies here
const Thread = ({ thread }) => {
    const [ showForm, setShowForm ] = useState(false)
    const [ replies, setReplies ] = useState([])
    const [ comments, setComments ] = useState([])

    const getRepliesHook = () => {
        const fetchReplies = async() => {
            const fetchReplies = await postService.getReplies(thread.postNum, 'threads')
            const fetchedReplies = fetchReplies.data.map(reply => reply.postNum)
            
            // console.log('replies:', fetchedReplies)
            setReplies(fetchedReplies)
            // console.log('threads reset')
        }
        fetchReplies()
    }


    // useEffect(getRepliesHook, [])

    const getCommentsHook = () => {
        const fetchComments = async() => {
            let fetchedComments = await postService.getComments(thread.postNum)
            fetchedComments = fetchedComments.data
            
            // console.log('comments:', fetchedComments)
            setComments(fetchedComments)
            // console.log('comments reset')
        }
        fetchComments()
    }

    // console.log('refreshing?')

    useEffect(getCommentsHook, [])
    useEffect(getRepliesHook, [])


    // pass thread num in comment form as well
    return (
        <>
            <div className="thread">
                <ReplyForm 
                    parent={thread.postNum} 
                    parentType={'thread'} 
                    isReply={true} 
                    replies={replies} 
                    setReplies={setReplies} 
                    comments={comments} 
                    setComments={setComments}
                    showForm={showForm} 
                    setShowForm={setShowForm}
                >
                </ReplyForm>

                <div className="postContainer opContainer">
                    <div id={thread.postNum} className="post op">
                        <File url={thread.url} filename={thread.filename} dimensions={thread.dimensions} thumbnailURL={thread.thumbnail250URL} filetype={thread.filetype}></File>
                        <PostInfo date={thread.date} postNum={thread.postNum} showForm={showForm} setShowForm={setShowForm} replies={replies}></PostInfo>
                        <PostText text={thread.text}></PostText>
                    </div>
                </div>

                <Posts posts={comments}></Posts>
            </div>
            <hr/>
        </>
    )
}

export default Thread;