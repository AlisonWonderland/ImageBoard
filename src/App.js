import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import ThreadForm from './components/ThreadForm'
import Threads from './components/Threads'

import postService from './services/post'

import './App.css';

// todo
/// clean code then style

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
    const [ threads, setThreads ] = useState([])
    
    console.log('threads', threads)
    
    const getThreadsHook = () => {
        const fetchThreads = async() => {
            const fetchThreads = await postService.getThreads()
            const fetchedThreads = fetchThreads.data
            
            setThreads(fetchedThreads)
            console.log('threads reset')
            // console.log('threads:', fetchThreads)
        }
        fetchThreads()
    }


    useEffect(getThreadsHook, [])

    // have boolean to switch between thread view and catalog view

    return (
        <>
            <Navbar />
            <ThreadForm threads={threads} setThreads={setThreads}>Create Thread</ThreadForm>
            <Threads threads={threads}></Threads>
        </>
    )
}

export default App;