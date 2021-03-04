import { useState, useEffect } from 'react'
import ThreadForm from './ThreadForm'
import Threads from './Threads'

import postService from '../services/post'


const Home = () => {
    const [ threads, setThreads ] = useState([])
    
    // console.log('threads', threads)
    
    const getThreadsHook = () => {
        const fetchThreads = async() => {
            const fetchThreads = await postService.getThreads()
            const fetchedThreads = fetchThreads.data
            
            setThreads(fetchedThreads)
            console.log('threads reset')
            // console.log('threads:', fetchThreads)
        }
        fetchThreads()
    }

    console.log('threads..', threads)

    console.log(threads)

    useEffect(getThreadsHook, [])

    return (
            threads.length ?
            <>
                <ThreadForm threads={threads} setThreads={setThreads}>Create Thread</ThreadForm>
                <Threads threads={threads}></Threads>
            </>
            :
            <h1>Loading threads...</h1>
    )
}

export default Home