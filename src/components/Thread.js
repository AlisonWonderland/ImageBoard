import { useState, useEffect } from 'react'
import ReplyForm from './ReplyForm'
import Posts from './Posts'
import File from './File'
import PostText from './PostText'
import PostInfo from './PostInfo'
import CommentLink from './CommentLink'

import { FormContextProvider } from './contexts'

import postService from '../services/post'

const Thread = ({ thread }) => {
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

    useEffect(getCommentsHook, [])
    useEffect(getRepliesHook, [])

    return (
        <>
            <div className="thread">
            <FormContextProvider 
                    parentThread={thread.postNum} 
                    parent={thread.postNum}
                    parentType={'thread'}
                >

                    <div className="postContainer opContainer">
                        <div id={thread.postNum} className="post op">
                            <File url={thread.url} filename={thread.filename} dimensions={thread.dimensions} thumbnailURL={thread.thumbnail250URL} filetype={thread.filetype}></File>
                            <PostInfo date={thread.date} postNum={thread.postNum} replies={replies} postType={'thread'}></PostInfo>
                            <PostText text={thread.text}></PostText>
                        </div>
                    </div>

                    <ReplyForm getCommentsHook={getCommentsHook} getRepliesHook={getRepliesHook}></ReplyForm>
                    <Posts posts={comments}></Posts>
                    {/* this will have to go in some footer */}
                    <CommentLink></CommentLink>
                </FormContextProvider>

            </div>
            <hr/>
        </>
    )
}

export default Thread;