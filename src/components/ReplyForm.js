import { useState, useContext } from 'react'
import postService from '../services/post'
import {generateFormData} from './helpers'
import { FormContext } from './contexts'

import Textarea from './Textarea'

const ReplyForm = ({getCommentsHook, getRepliesHook}) => {
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
        setFile(e.target.files[0])
    }

    // console.log(replyText)

    return (
        <div className="replyFormContainer" style={{display: showForm ? "": "none"}}>
            <form onSubmit={handleSubmission}>
                <span className="replyHeader">Reply to Thread No. {parent} <img alt="X" src="./assets/cross.png" className="closeFormBtn" onClick={handleClose}></img></span>
                <br/>
                <Textarea></Textarea>
                <br/>
                <div className=""></div>
                <input name="file" type="file" onChange={handleFileChange} key={Date.now()}/>
                <input type="submit" value="Submit comment"/>
            </form>
        </div>
    )
}

export default ReplyForm;