import React from 'react'
import Thread from './Thread'

const Threads = ({ threads }) => {
    // first just the thread image and title/ submission text
    // we can save showing the replies in threads view until later.

    return (
        <div className="threads">
            {threads.map(thread => {
                return (
                    <Thread key={thread.id} thread={thread}></Thread>
                )
            })}
        </div>
    )
}

export default Threads;