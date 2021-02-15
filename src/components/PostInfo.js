import ReplyList from './ReplyList'

const PostInfo = (postInfo) => {
    const handleReplyClick = (e) => {
        e.preventDefault()
        postInfo.setShowForm(!postInfo.showForm)
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

        localDate = localDate.replace(/\s/g, '');
        return localDate + ' '
    }

    return (
        <div className="postInfo">
            <span className="nameBlock"><strong> Anonymous&nbsp;</strong> </span> 
            {formatDate(postInfo.date)} 
            <span className="postNum"><a href={`#${postInfo.postNum}`}> No. </a><a href={`#${postInfo.postNum}`} onClick={handleReplyClick}>{postInfo.postNum}</a> &nbsp;</span> 
            [<a href="posturl">Reply</a>] &gt; 
            {/* replies */}
            <a href="#thread"> &gt;&gt;010010101</a>
        </div>
    )
}

export default PostInfo