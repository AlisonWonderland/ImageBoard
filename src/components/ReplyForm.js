import React, { useState } from 'react'
import postService from '../services/post'

// add reply endpoint/route
// files aren't needed
// work with images adn then just with text
const ReplyForm = ({ posts, setPosts, threadID, showForm, setShowForm }) => {
    const [ file, setFile ] = useState(null)
    // const [ hide, setHide ] = useState(showForm)
    const [ replyText, setReplyText ] = useState('')

    const handleSubmission = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        postService.upload(formData)
            .then(response => {
                // // console.log(response)
                // // console.log(response.data.url)
                // // console.log(response.data.filetype)
                // // this will concat url in final
                // console.log('thread data', response.data)

                // in the future no need for url, thumbnail url update
                setPosts(posts.concat({ ...response.data, 
                    url: 'test_pics/' + response.data.url, 
                    thumbnailURL: 'test_pics/' + response.data.url[0] + 'thumb' + response.data.url[-4],
                    replyText
                }))
                // console.log('Threads updated after upload')
                setReplyText('')
                setShowForm(!showForm)
                // setHide(!hide)
                // // setFile(null)
            })
            .catch((error) => {
                alert('Upload error occured')
                console.log('====error:', error)
            });
    }

    // unnecessary
    // const handleClick = () => {
    //     setHide(!hide)
    // }

    const handleClose = () => {
        setReplyText('')
        setShowForm(!showForm)
    }

    // const handleTitleChange = (e) => {
    //     setTitle(e.target.value)
    // }

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