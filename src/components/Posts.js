import Post from './Post'
import HomePost from './HomePost'
import { v4 as uuidv4 } from 'uuid';

const Posts = ({ posts, viewType }) => {
    if(viewType === 'thread') {
        return (
            posts.map(post => {
                return <Post key={uuidv4()} post={post}></Post>
            })
        )
    }

    // limit five posts for home view
    else {
        const homePosts = posts.slice(0, 5)
        return (
            homePosts.map(post => {
                return <HomePost key={uuidv4()} post={post}></HomePost>
            })
        )
    }
}

export default Posts