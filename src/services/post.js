import axios from 'axios'
const baseUrl = 'http://localhost:3001/api'

const getThreads = async () => {
    return await axios.get(`${baseUrl}/threads`)
}

const getComments = async (postNum) => {
    return await axios.get(`${baseUrl}/threads/${postNum}/comments`)
}

const getReplies = async (postNum) => {
    return await axios.get(`${baseUrl}/threads/${postNum}/replies`)
}

const upload = (formData, postType) => {
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    let url = ""

    if(postType === "reply") 
        url = `${baseUrl}/comment`
    else if(postType === "thread")
        url = `${baseUrl}/${postType}s`
    else
        url = `${baseUrl}/${postType}`

    console.log('thre url:', url)
    
    for (var p of formData) {
        console.log('data', p);
    }
    return axios.post(url, formData, config)
            .then((response) => {
                return response
            }).catch((error) => {
                console.log('error occured', error)
            });
}

export default 
{ 
    getThreads,
    getComments,
    getReplies,
    upload 
}