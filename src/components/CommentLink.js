import { useContext } from 'react'
import { FormContext } from './contexts'

const CommentLink = () => {
    const { handleFormOpen, parentThread } = useContext(FormContext)

    const handleClick = () => {
        handleFormOpen(parentThread, 'thread', false)
    }

    return (
        <a href="#" onClick={handleClick}>Post a comment</a>
    )
}

export default CommentLink