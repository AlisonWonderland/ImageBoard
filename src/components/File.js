import {useState} from 'react'
import useWindowDimensions from './hooks/windowDimension'

const File = (fileInfo) => {
    const [ showFullSize, setShowFullSize ] = useState(false)
    const { windowHeight, windowWidth } = useWindowDimensions()
    const [ showThumbnail, setShowThumbnail ] = useState(true)
    const fileDimensions = JSON.parse(fileInfo.dimensions)

    const handleThumbnailClick = (e) => {
        e.preventDefault()

        if(fileInfo.filetype === "video") {
            setShowThumbnail(false)
            setShowFullSize(true)
        }
        else {
            setShowThumbnail(!showThumbnail)
            setShowFullSize(!showFullSize)
        }
    }


    const getMaxDimensions = (dimensions) => {
        const aspectRatio = dimensions.width / dimensions.height
        console.log('ratio', aspectRatio)
        const maxWidth = windowWidth - 70
        let maxHeight = 0

        if(dimensions.width <= maxWidth)
            maxHeight = dimensions.height
        else
            maxHeight = maxWidth / aspectRatio

            return { maxWidth, maxHeight }
    }


    let fullSizeContent = null

    if(showFullSize)
        if(fileInfo.filetype === "image")
            fullSizeContent = <img 
                                className="thumbnail-exp" 
                                src={fileInfo.url} alt="" 
                                style={getMaxDimensions(fileDimensions)}>
                                </img>
        else
            fullSizeContent =   <video controls loop autoPlay muted className="vid-exp">
                                    <source src={fileInfo.url} type="video/webm" />
                                    Your browser does not support the video tag.
                                </video>

    return (
        <div className="file">
            <div className="fileInfo">
                File: <a href={fileInfo.url} target="_blank" rel="noreferrer">
                        {fileInfo.filename}
                    </a> 
                    ({fileDimensions.width}x{fileDimensions.height})
            </div>
            <a href={fileInfo.url} onClick={handleThumbnailClick}>
                <img className="thumbnail" src={fileInfo.thumbnailURL} alt=""style={{display: showThumbnail ? "": "none"}} />
                {fullSizeContent}
            </a>
        </div>
    )
}

export default File