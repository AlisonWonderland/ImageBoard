const ThreadData = ({ threadData }) => {
    
    return (
        <span>Comments: {threadData.numComments} / Images: {threadData.numImages}</span>
    )
}

export default ThreadData