import React from 'react'
import Post from './Post'

const Posts = ({ posts }) => {
    return (
        posts.map(post => {
            return <Post key={post.id} post={post}></Post>
        })
    )
}

export default Posts