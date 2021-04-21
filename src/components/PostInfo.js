import { useContext } from 'react'
import ReplyList from './ReplyList'
import { FormContext } from './contexts'

const PostInfo = (postInfo) => {
    const { handleFormOpen } = useContext(FormContext)
    
    const handleReplyClick = (e) => {
        handleFormOpen(postInfo.post_num, postInfo.postType, true)
    }

    const formatDate = (threadDate) => {
        let localDate = new Date(threadDate).toLocaleDateString(undefined, {
            month:'numeric', 
            day:'numeric',
            year: '2-digit', 
            weekday:'short', 
            hour:'numeric', 
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        })

        localDate = localDate.replace(/\s/g, ' ');
        return localDate + ' '
    }
    // console.log('replies in postinfo:', postInfo.replies, 'and num:', postInfo.post_num)

    return (
        <div className="postInfo">
            <span className="nameBlock"><strong> Anonymous&nbsp;</strong> </span> 
            {formatDate(postInfo.date)} 
            <span className="postNum">
                No. 
                <span>
                    {postInfo.postNum}
                </span> &nbsp;
            </span> 
            [<a href="#" onClick={handleReplyClick}>Reply</a>] &gt; 
            
            <ReplyList replies={postInfo.replies}></ReplyList>
        </div>
    )
}

export default PostInfo