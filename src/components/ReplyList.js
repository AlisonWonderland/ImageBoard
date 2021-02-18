const ReplyList = ({ replies }) => {
    return (
        <>
        {
            replies.map(reply => {
                return (
                    <a href={`#${reply}`} className="replyLink" key={reply}> &gt;&gt;{reply}</a>
                )
            })
        }
        </>
    )
}

export default ReplyList