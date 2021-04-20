import File from './File'
import PostText from './PostText'
import PostInfo from './PostInfo'

// difference from Post.js is that this component does fetch replies

const HomePost = ({ post }) => {

    const fileElement = post.url === undefined ?
        <></>
        :   <File 
                url={post.url} 
                filename={post.filename} 
                dimensions={post.dimensions} 
                thumbnailURL={post.thumbnail125URL} 
                filetype={post.filetype}>    
            </File>

    return (
        <div id={post.postNum} className="postContainer replyContainer">
            <div className="sideArrows">&gt;&gt;</div>
            <div className="post reply">
                <PostInfo 
                    date={post.date} 
                    postNum={post.postNum} 
                    replies={[]} 
                    postType={'comment'}>
                </PostInfo>
                {fileElement}
                <PostText text={post.text}></PostText>
            </div>
        </div>
    )
}

export default HomePost