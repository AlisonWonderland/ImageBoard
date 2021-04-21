// import Thread from './Thread'
import { useState, useEffect } from 'react'
import File from './File'
import PostInfo from './PostInfo'
import PostText from './PostText'
import Posts from './Posts'

import postService from '../services/post'


const HomeThread = ({ thread }) => {
    console.log('thread', thread)
    const [ comments, setComments ] = useState([])
    
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

    // useEffect(getCommentsHook, [thread.post_num])

    return (
        <div className="thread homeThread">
           <div className="postContainer opContainer">
                    <div id={thread.post_num} className="post op">
                        <File url={thread.post_url} 
                            filename={thread.post_filename} 
                            dimensions={thread.post_dimensions} 
                            thumbnailURL={thread.thumbnail250URL} 
                            filetype={thread.filetype}>
                        </File>
                        <PostInfo date={thread.post_date} postNum={thread.post_num} replies={[]} postType={'thread'}></PostInfo>
                        <PostText text={thread.post_text}></PostText>
                    </div>
            </div>

            {/* <Posts posts={comments} viewType={'home'}></Posts> */}
        </div>
    )
}

export default HomeThread;