import React, { useState, useEffect } from 'react'
import File from './File'
import PostText from './PostText'
import PostInfo from './PostInfo'

import postService from '../services/post'

const PostNonMemo = ({ post }) => {
    const [ replies, setReplies ] = useState([])

    const getRepliesHook = () => {
        let isMounted = true
        const fetchReplies = async() => {
            const fetchReplies = await postService.getReplies(post.post_num, 'comment')
            const fetchedReplies = fetchReplies.data.map(reply => reply.post_num)
            
            // console.log('replies:', fetchedReplies)
            if(isMounted)
                setReplies(fetchedReplies)
            // console.log('threads reset')
        }
        fetchReplies()
        return () => { isMounted = false}
    }

    useEffect(getRepliesHook, [post.post_num])

    const fileElement = post.post_url === undefined ?
        <></>
        :   <File url={post.post_url} 
                filename={post.post_filename} 
                dimensions={post.post_dimensions} 
                thumbnailURL={post.thumbnail125URL} 
                filetype={post.filetype}>
            </File>

    return (
        <div id={post.post_num} className="postContainer replyContainer">
            <div className="sideArrows">&gt;&gt;</div>
            <div className="post reply">
                <PostInfo date={post.post_date} postNum={post.post_num} replies={replies} postType={'comment'}></PostInfo>
                {fileElement}
                <PostText text={post.post_text}></PostText>
            </div>
        </div>
    )
}

const Post = React.memo(PostNonMemo)

export default Post