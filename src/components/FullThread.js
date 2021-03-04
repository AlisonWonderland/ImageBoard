import React, { useState, useEffect } from 'react'
import {
    useParams
} from "react-router-dom";

import Thread from './Thread'
import postService from '../services/post'

const FullThread = () => {
    let { threadID } = useParams();
    const [ thread, setThread ] = useState({})

    const getThreadHook = () => {
        const fetchThread = async() => {
            const fetchThread = await postService.getThread(threadID)
            const fetchedThread = fetchThread.data
            
            setThread(fetchedThread)
        }
        fetchThread()

    }

    useEffect(getThreadHook, [threadID])

    return (
        <>
            {
                thread.postNum === undefined ? 
                <></>
                : <Thread thread={thread}></Thread>
            }
        </>
    )
}

export default FullThread