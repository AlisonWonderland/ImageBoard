const ThreadData = ({ threadData }) => {
    
    return (
        <span>Comments: {threadData.num_comments} / Images: {threadData.num_images}</span>
    )
}

export default ThreadData