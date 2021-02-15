import React, { useState } from 'react'
import postService from '../services/post'

const ThreadForm = ({ threads, setThreads }) => {
    const [ file, setFile ] = useState(null)
    const [ hide, setHide ] = useState(true)
    // const [ title, setTitle ] = useState('')
    const [ submissionText, setSubmissionText ] = useState('')

    const handleSubmission = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file)
        formData.append('postType', 'thread')
        formData.append('text', submissionText)

        postService.upload(formData, 'thread')
            .then(response => {
                console.log('thread data', response)
                setThreads(threads.concat(response.data))
                console.log('Threads updated after upload')
                // setTitle('')
                setSubmissionText('')
                setHide(!hide)
                // setFile(null)
            })
            .catch((error) => {
                alert('Upload error occured')
                console.log('====error:', error)
            });
    }

    const handleClick = () => {
        setHide(!hide)
    }

    // const handleTitleChange = (e) => {
    //     setTitle(e.target.value)
    // }

    const handleSubmissionTextChange = (e) => {
        setSubmissionText(e.target.value)
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    return (
        <div className="threadFormContainer">
            <form style={{display: hide ? "none": ""}} onSubmit={handleSubmission}>
                <textarea name="submissionText" placeholder="Thread text" id="" cols="50" rows="10" value={submissionText} onChange={handleSubmissionTextChange}></textarea>
                <br/>
                <input name="file" type="file" onChange={handleFileChange}/>
                <input type="submit" value="Create Thread"/>
            </form>
            <button style={{display: !hide ? "none": ""}} onClick={handleClick}>Create Thread</button>
        </div>
    )
}

export default ThreadForm;