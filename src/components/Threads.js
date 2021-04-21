import HomeThread from './HomeThread'

const Threads = ({ threads }) => {
    console.log('threads befor home:', threads)
    return (
        <div className="threads">
            {threads.map(thread => {
                return (
                    <HomeThread key={thread.post_id} thread={thread} />
                )
            })}
        </div>
    )
}

export default Threads;