import React, { useState } from 'react'
import postService from '../services/post'

// add reply endpoint/route
// files aren't needed
// work with images adn then just with text
const ReplyForm = ({ posts, setPosts, threadID, showForm, setShowForm }) => {
    const [ file, setFile ] = useState(null)
    const [ replyText, setReplyText ] = useState('')

    // normally we're going to want the reply text to be sent to the backend
    const handleSubmission = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        postService.upload(formData)
            .then(response => {
                setPosts(posts.concat({ ...response.data, 
                    replyText
                }))
                setReplyText('')
                setShowForm(!showForm)
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
                <span className="replyHeader">Reply to Thread No. {threadID} <img alt="X" src="./assets/cross.png" className="closeFormBtn" onClick={handleClose}></img></span>
                <br/>
                <textarea name="replyText" placeholder="Comment" id="" cols="50" rows="10" value={replyText} onChange={handleReplyTextChange}></textarea>
                <br/>
                <div className=""></div>
                <input name="file" type="file" onChange={handleFileChange}/>
                <input type="submit" value="Create Thread"/>
            </form>
        </div>
    )
}

export default ReplyForm;