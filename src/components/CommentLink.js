import React, { useContext } from 'react'
import { FormContext } from './contexts'

const CommentLink = () => {
    const { handleFormOpen, parentThread } = useContext(FormContext)

    const handleClick = (e) => {
        e.preventDefault();
        handleFormOpen(parentThread, 'thread', false)
    }

    console.log('checking')

    return (
            <span>
                [ <a href="#" onClick={handleClick}>Post a comment</a> ]
            </span>
    )
}

export default CommentLink