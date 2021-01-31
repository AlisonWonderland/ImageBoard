import React from 'react'
import Post from './Post'

const Posts = ({ posts }) => {
    // technically don't need type
    return (
        posts.map(post => {
            return <Post key={post.id} post={post}></Post>
        })
    )
}

export default Posts

// return (
//     posts.map(post => {
//         if(post.filetype === "video") {
//             return (
//                 <div key={post.id}>
//                     <video width="320" height="240" controls>
//                         <source src={post.url} type="video/webm" />
//                         Your browser does not support the video tag.
//                     </video>
//                 </div>
//             )
//         }
//         else {
//             return (
//                 <div key={post.id}>
//                     <img src={post.url} alt="" />
//                 </div>
//             ) 
//         }
//     })
// )
