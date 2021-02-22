import Thread from './Thread'

const Threads = ({ threads }) => {

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