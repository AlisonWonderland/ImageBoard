import HomeThread from './HomeThread'

const Threads = ({ threads }) => {

    return (
        <div className="threads">
            {threads.map(thread => {
                return (
                    <HomeThread key={thread.id} thread={thread}></HomeThread>
                )
            })}
        </div>
    )
}

export default Threads;