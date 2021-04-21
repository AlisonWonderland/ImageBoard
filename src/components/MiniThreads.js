import MiniThread from './MiniThread'
import { v4 as uuidv4 } from 'uuid';

const MiniThreads = ({ threads }) => {
    console.log(threads)
    return (
        <div className="miniThreads">
            {threads.map(thread => {
                return (
                    <MiniThread key={uuidv4()} thread={thread}></MiniThread>
                )
            })}
        </div>

    )
}

export default MiniThreads