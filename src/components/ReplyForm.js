import React, { useState } from 'react'
import postService from '../services/post'
import {generateFormData} from './helpers'

const ReplyForm = ({ parent, parentType, isReply, replies, setReplies, comments, setComments, showForm, setShowForm }) => {
    const [ file, setFile ] = useState(null)
    const [ replyText, setReplyText ] = useState('')

    const handleSubmission = (e) => {
        e.preventDefault();

        if(file === null && replyText === '') {
            alert('File or comment needed for submission')
            return
        }

        const formData = generateFormData(file, replyText, isReply, parent, parentType);

        postService.upload(formData, isReply ? 'reply' : 'comment')
        .then(response => {
                // setReplies(replies.concat(response.data))
                setComments(comments.concat(response.data))
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
        setShowForm(!showForm)
    }

    const handleReplyTextChange = (e) => {
        setReplyText(e.target.value)
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    return (
        <div className="replyFormContainer" style={{display: showForm ? "": "none"}}>
            <form onSubmit={handleSubmission}>
                <span className="replyHeader">Reply to Thread No. {parent} <img alt="X" src="./assets/cross.png" className="closeFormBtn" onClick={handleClose}></img></span>
                <br/>
                <textarea name="replyText" placeholder="Comment" id="" cols="50" rows="10" value={replyText} onChange={handleReplyTextChange}></textarea>
                <br/>
                <div className=""></div>
                <input name="file" type="file" onChange={handleFileChange} key={Date.now()}/>
                <input type="submit" value="Submit comment"/>
            </form>
        </div>
    )
}

export default ReplyForm;