import React, { useState, useEffect } from 'react'
import ReplyForm from './ReplyForm'
import Posts from './Posts'
import File from './File'
import PostText from './PostText'
import PostInfo from './PostInfo'
import NavRow from './NavRow'
import { FormContextProvider } from './contexts'

import postService from '../services/post'

const ThreadNonMemo = ({ thread }) => {
    const [ replies, setReplies ] = useState([])
    const [ comments, setComments ] = useState([])
    const [ data, setData ] = useState({})

    console.log('thread from full:', thread)

    const getRepliesHook = () => {
        const fetchReplies = async() => {
            const fetchReplies = await postService.getReplies(thread.post_num, 'threads')
            const fetchedReplies = fetchReplies.data
            
            // console.log('replies:', fetchedReplies)
            setReplies(fetchedReplies)
            // console.log('threads reset')
        }
        fetchReplies()
    }

    const getCommentsHook = () => {
        const fetchComments = async() => {
            let fetchedComments = await postService.getComments(thread.post_num)
            fetchedComments = fetchedComments.data
            
            // console.log('comments:', fetchedComments)
            setComments(fetchedComments)
            // console.log('comments reset')
        }
        fetchComments()
    }

    const getThreadDataHook = () => {
        const fetchData = async() => {
            let fetchedData = await postService.getThreadData(thread.post_num)
            fetchedData = fetchedData.data

            setData(fetchedData)
        }
        fetchData()
    }

    useEffect(getCommentsHook, [thread.post_num])
    useEffect(getRepliesHook, [thread.post_num])
    useEffect(getThreadDataHook, [thread.post_num])

    // console.log('thread rerendered?')

    return (
        <>
            <div className="thread">
                <FormContextProvider 
                    parentThread={thread.post_num} 
                    parent={thread.post_num}
                    parentType={'thread'}
                >
                    <NavRow threadData={data} type="top"></NavRow>
                    <div className="threadContainer">
                        <div className="postContainer opContainer">
                            <div id={thread.post_num} className="post op">
                                <File 
                                    url={thread.post_url} 
                                    filename={thread.post_filename} 
                                    dimensions={thread.post_dimensions} 
                                    thumbnailURL={thread.thumbnail250URL} 
                                    filetype={thread.filetype}>
                                </File>
                                <PostInfo 
                                    date={thread.post_date} 
                                    postNum={thread.post_num} 
                                    replies={replies} 
                                    postType={'thread'}>
                                </PostInfo>
                                <PostText text={thread.post_text}></PostText>
                            </div>
                        </div>

                        <ReplyForm 
                            getCommentsHook={getCommentsHook} 
                            getRepliesHook={getRepliesHook} 
                            getThreadDataHook={getThreadDataHook}>
                        </ReplyForm>
                        <Posts posts={comments} viewType='thread'></Posts>
                    </div>
                    {/* this will have to go in some footer */}
                    <NavRow threadData={data} type="bot"></NavRow>
                </FormContextProvider>

            </div>
            <hr/>
        </>
    )
}

const Thread = React.memo(ThreadNonMemo)

export default Thread;