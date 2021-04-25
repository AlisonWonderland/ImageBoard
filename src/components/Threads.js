import HomeThread from './HomeThread'
import { v4 as uuidv4 } from 'uuid';

const Threads = ({ threads }) => {
    console.log('threads befor home:', threads)
    return (
        <div className="threads">
            {threads.map(thread => {
                return (
                    <HomeThread key={uuidv4()} thread={thread} />
                )
            })}
        </div>
    )
}

export default Threads;