import React from 'react'

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

// const ReplyList = React.memo(ReplyListNonMemo)

export default ReplyList