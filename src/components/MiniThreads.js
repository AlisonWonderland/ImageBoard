import MiniThread from './MiniThread'
const MiniThreads = ({ threads }) => {
    
    return (
        <div className="miniThreads">
            {threads.map(thread => {
                return (
                    <MiniThread key={thread.id} thread={thread}></MiniThread>
                )
            })}
        </div>

    )
}

export default MiniThreads