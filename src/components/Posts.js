import Post from './Post'
import { v4 as uuidv4 } from 'uuid';

const Posts = ({ posts }) => {
    return (
        posts.map(post => {
            return <Post key={uuidv4()} post={post}></Post>
        })
    )
}

export default Posts