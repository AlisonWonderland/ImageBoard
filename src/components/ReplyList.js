import React from 'react'
import { v4 as uuidv4 } from 'uuid';

const ReplyList = ({ replies }) => {
    // console.log('replies', replies)
    return (
        <>
        {
            replies.map(reply => {
                return (
                    <a href={`#${reply}`} className="replyLink" key={uuidv4()}> &gt;&gt;{reply}</a>
                )
            })
        }
        </>
    )
}

// const ReplyList = React.memo(ReplyListNonMemo)

export default ReplyList