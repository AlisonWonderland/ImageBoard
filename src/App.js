import React, { useState } from 'react'
import imageService from './services/image'
import Posts from './components/Posts'
import Navbar from './components/Navbar'
import ThreadForm from './components/ThreadForm'
import Threads from './components/Threads'
import ReplyForm from './components/ReplyForm'
import './App.css';
import axios from 'axios'

// todo
/// clean code then style
// try out imgur api
// get image size https://stackoverflow.com/questions/12539918/get-the-width-and-height-of-an-image-in-node-js

// create thread button and form
// alternate between thread view and catalog view
// change posts into components

// LETS USE REACT ROUTER/ multi page setup


// finish thread view first, infinite replies for know on thread view.
// do this to keep track of replies, threads, etc
// one page for gallery, first
// one home page showing all threads
// threads are just a picture/media and need text
// going to have to ccheck if an image is attached


// resources 
// https://web.dev/browser-level-image-lazy-loading/
// https://css-tricks.com/the-complete-guide-to-lazy-loading-images/
// https://css-tricks.com/preventing-content-reflow-from-lazy-loaded-images/
// https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path
// https://stackoverflow.com/questions/13079742/how-to-generate-video-thumbnail-in-node-js
// https://code.tutsplus.com/tutorials/how-to-create-a-resumable-video-uploader-in-nodejs--net-25445

// theme inspiration
// https://www.toptal.com/designers/htmlarrows/math/greater-than-sign/

// features
// go to top
// bottom
// let op's change the threads theme
// create a preview of the thread as they create it.


function App() {
    const [ file, setFile ] = useState(null)
    const [ posts, setPosts ] = useState([])
    const [ threads, setThreads ] = useState([])
    
    console.log('file', file)
    console.log('threads', threads)
    // console.log('urls', posts)

    const onFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        imageService.upload(formData)
            .then(response => {
                // console.log(response)
                // console.log(response.data.url)
                // console.log(response.data.filetype)
                // this will concat url in final
                setPosts(posts.concat({ ...response.data, url: 'test_pics/' + response.data.url}))
                console.log('posts updated after upload')
                // setFile(null)
            })
            .catch((error) => {
                alert('Upload error occured')
                console.log('====error:', error)
            });

        // console.log(formData.get('file'))
        // const config = {
        //     headers: {
        //         'content-type': 'multipart/form-data'
        //     }
        // };

        // axios.post('http://localhost:3001/upload',formData, config)
        //     .then((response) => {
        //         // console.log(response)
        //         // console.log(response.data.url)
        //         // console.log(response.data.filetype)
        //         // this will concat url in final
        //         setPosts(posts.concat({ ...response.data, url: 'test_pics/' + response.data.url}))
        //         setFile(null)
        //     }).catch((error) => {
        //         console.log('====error:', error)
        // });
    }

    const onChange = (e) => {
        console.log('changed called')
        setFile(e.target.files[0]);
    }

    // have boolean to switch between thread view and catalog view

    return (
        <>
            <Navbar />
            <ThreadForm threads={threads} setThreads={setThreads}>Create Thread</ThreadForm>
            <Threads threads={threads}></Threads>

            <div className="thread"></div>
            <form onSubmit={onFormSubmit}>
                <h1>File Upload</h1>
                <input type="file" name="file" onChange={onChange} />
                <button type="submit">Upload</button>
            </form>
            <img src="test_pics/0.jpg" alt="Girl in a jacket" width="300" height="500" />
            <Posts posts={posts} />
            
            <div className="thread">
                <div className="postContainer opContainer">
                    <div className="post op">
                        <div className="file">
                            <div className="fileInfo">
                                File: <a href="test_pics/1.jpg" target="_blank">1.jpg</a> (300x100)
                            </div>
                            <a href="test_pics/0.jpg">
                                <img className="thumbnail" src="test_pics/0thumb.jpg" alt="" />    
                            </a>
                        </div>
                        <div className="postInfo">
                            <strong>KPOP GENERAL</strong> Anonymous 01/14/21(Thu)21:32:56 No.100922414 [<a href="posturl">Reply</a>] &gt; <a href="#reply1">&gt;&gt;010010101</a>
                        </div>
                        <blockquote className="postMessage" cite="https://www.huxley.net/bnw/four.html">
                            Words can be like X-rays, if you use them properly—they’ll go through anything. You read and you’re pierced.
                            blah blah
                        </blockquote>
                    </div>
                </div>
                
                <div id="reply1" className="postContainer replyContainer">
                    <div className="sideArrows">&gt;</div>
                    <div className="post reply">
                        <div className="postInfo">
                            <span className="nameBlock">Anonymous</span> 01/15/21(Fri)10:37:30 No.100933414 [<a href="posturl">Reply</a>] &gt; sjafjlalk
                        </div>
                        <div className="file">
                            <div className="fileInfo">
                                File: <a href="test_pics/1.jpg" target="_blank">1.jpg</a> (File data)
                            </div>
                            <a href="test_pics/0.jpg">
                                <img className="thumbnail" src="test_pics/0thumb.jpg" alt=""/>    
                            </a>
                        </div>
                        <blockquote className="postMessage" cite="https://www.huxley.net/bnw/four.html">
                            what a banger! cmon chat what are you doing ijwieojiojoijjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj
                            wjefjo
                            what a banger! cmon chat what are you doing what a banger! cmon chat what are you doing
                        </blockquote>
                    </div>
                </div>

                <div id="reply2" className="postContainer replyContainer">
                    <div className="sideArrows">&gt;&gt;</div>
                    <div className="post reply">
                        <div className="postInfo">
                            Anonymous 01/15/21(Fri)10:37:30 No.100933414 [<a href="posturl">Reply</a>] &gt;
                        </div>
                        <blockquote className="postMessage" cite="https://www.huxley.net/bnw/four.html">
                            what a banger! cmon chat what are you doing ijwieojiojoi
                        </blockquote>
                    </div>
                </div>

            </div>
        </>
    )
}

export default App;