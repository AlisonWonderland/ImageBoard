// import Thread from './Thread'
import { useState, useEffect } from 'react'
import File from './File'
import PostInfo from './PostInfo'
import PostText from './PostText'
import Posts from './Posts'

import postService from '../services/post'


const HomeThread = ({ thread }) => {
    const [ comments, setComments ] = useState([])
    
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

    useEffect(getCommentsHook, [thread.postNum])

    return (
        <div className="thread homeThread">
           <div className="postContainer opContainer">
                    <div id={thread.postNum} className="post op">
                        <File url={thread.url} filename={thread.filename} dimensions={thread.dimensions} thumbnailURL={thread.thumbnail250URL} filetype={thread.filetype}></File>
                        <PostInfo date={thread.date} postNum={thread.postNum} replies={[]} postType={'thread'}></PostInfo>
                        <PostText text={thread.text}></PostText>
                    </div>
            </div>

            <Posts posts={comments} viewType={'home'}></Posts>
        </div>
    )
}

export default HomeThread;