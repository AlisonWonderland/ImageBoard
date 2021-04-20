import React, { useContext } from 'react'
import { FormContext } from './contexts'

const CommentLink = () => {
    const { handleFormOpen, parentThread } = useContext(FormContext)

    const handleClick = (e) => {
        e.preventDefault();
        handleFormOpen(parentThread, 'thread', false)
    }

    return (
            <span className="postCommentLink">
                [ <a href="#" onClick={handleClick}>Post a comment</a> ]
            </span>
    )
}

export default CommentLink