import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import ThreadForm from './components/ThreadForm'
import Threads from './components/Threads'
import ThreadsCatalog from './components/ThreadsCatalog'
import postService from './services/post'

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import './App.css';
import FullThread from './components/FullThread'

function App() {
    const [ threads, setThreads ] = useState([])
    
    // console.log('threads', threads)
    
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

    console.log('threads..', threads)

    console.log(threads)

    useEffect(getThreadsHook, [])

    return (
        <>
            <Router>
                <Navbar />
                <Switch>
                    <Route exact path="/Catalog">
                        <ThreadsCatalog />
                    </Route>
                    <Route exact path="/">
                        {
                            threads.length ?
                            <>
                                <ThreadForm threads={threads} setThreads={setThreads}>Create Thread</ThreadForm>
                                <Threads threads={threads}></Threads>
                            </>
                            :
                            <h1>Loading threads...</h1>
                        }
                    </Route>
                    <Route exact path="/thread/:threadID">
                        <FullThread threads={threads}></FullThread>
                    </Route>
                </Switch>
            </Router>
        </>
    )
}

export default App;