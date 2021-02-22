import { useContext } from 'react'
import { FormContext } from './contexts'


const Textarea = () => {
    const { replyText, setReplyText } = useContext(FormContext)
    
    const handleReplyTextChange = (e) => {
        setReplyText(e.target.value)
    }

    return (
        <textarea name="replyText" placeholder="Comment" id="" cols="50" rows="10" value={replyText} onChange={handleReplyTextChange} autoFocus></textarea>
    )
}

export default Textarea