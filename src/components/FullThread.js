import {
    useParams
} from "react-router-dom";

import Thread from './Thread'

const FullThread = ({ threads }) => {
    let { threadID } = useParams();

    let matchedThread = {}
    for(let i = 0; i < threads.length; ++i) {
        if(threads[i].postNum == threadID)
            matchedThread = threads[i]
    }

    return (
        <>
            <Thread thread={matchedThread}></Thread>
        </>
    )
}

export default FullThread