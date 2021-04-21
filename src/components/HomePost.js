import File from './File'
import PostText from './PostText'
import PostInfo from './PostInfo'

// difference from Post.js is that this component does fetch replies

const HomePost = ({ post }) => {

    const fileElement = post.post_url === undefined ?
        <></>
        :   <File 
                url={post.post_url} 
                filename={post.post_filename} 
                dimensions={post.post_dimensions} 
                thumbnailURL={post.thumbnail125URL} 
                filetype={post.filetype}>    
            </File>

    return (
        <div id={post.post_num} className="postContainer replyContainer">
            <div className="sideArrows">&gt;&gt;</div>
            <div className="post reply">
                <PostInfo 
                    date={post.post_date} 
                    postNum={post.post_num} 
                    replies={[]} 
                    postType={'comment'}>
                </PostInfo>
                {fileElement}
                <PostText text={post.post_text}></PostText>
            </div>
        </div>
    )
}

export default HomePost