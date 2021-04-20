import { useState, useContext } from 'react'
import postService from '../services/post'
import {generateFormData} from './helpers'
import { FormContext } from './contexts'

import Textarea from './Textarea'

const ReplyForm = ({getCommentsHook, getRepliesHook, getThreadDataHook}) => {
    const { parent, 
        parentType, 
        isReply,
        showForm, 
        setShowForm,
        replyText,
        setReplyText
    } = useContext(FormContext)

    const [ file, setFile ] = useState(null)
    // const [ replyText, setReplyText ] = useState(`>>${parent} \n`)

    const handleSubmission = (e) => {
        e.preventDefault();

        if(file === null && replyText === '') {
            alert('File or comment needed for submission')
            return
        }

        const formData = generateFormData(file, replyText, isReply, parent, parentType);

        postService.upload(formData, isReply ? 'reply' : 'comment')
        .then(response => {
                getCommentsHook()
                getRepliesHook()
                getThreadDataHook()
                setReplyText('')
                setShowForm(!showForm)
                e.target.value = null
            })
            .catch((error) => {
                alert('Upload error occured')
                console.log('====error:', error)
            });
    }

    const handleClose = () => {
        setReplyText('')
        setShowForm(false)
    }

    // const handleReplyTextChange = (e) => {
    //     setReplyText(e.target.value)
    // }

    const handleFileChange = (e) => {
        console.log('files', e.target.files[0])
        setFile(e.target.files[0])
    }

    return (
        <div className="replyFormContainer" style={{display: showForm ? "": "none"}}>
            <form onSubmit={handleSubmission}>
                <span className="replyHeader">
                    Reply to Thread No. {parent} 
                    <span className="closeFormBtn" onClick={handleClose}>X</span>
                </span>
                <br/>
                <Textarea></Textarea>
                <br/>
                <div className="formBtnsContainer">
                    <input name="file" type="file" onChange={handleFileChange}/>
                    <input className="submitFormInput" type="submit" value="Submit comment"/>
                </div>
            </form>
        </div>
    )
}

export default ReplyForm;