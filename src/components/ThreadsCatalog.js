import { useState, useEffect } from 'react'
import MiniThreads from './MiniThreads.js'
import postService from '../services/post'

const ThreadsCatalog = () => {
    const [ threads, setThreads ] = useState([])

    const getThreadsHook = () => {
        const fetchData = async() => {
            let fetchedData = await postService.getThreadsData()
            fetchedData = fetchedData.data

            // console.log('minis:', fetchedData)
            setThreads(fetchedData)
        }
        fetchData()
    }


    useEffect(getThreadsHook, [])

    return (
        <>
            {
                threads.length ?
                    <MiniThreads threads={threads}></MiniThreads>
                    : <h1>Loading threads...</h1>
            }

        </>
    )
}

export default ThreadsCatalog