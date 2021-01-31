import axios from 'axios'
const baseUrl = 'http://localhost:3001/upload'

const upload = (formData) => {
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    // for (var p of formData) {
    //     console.log('data', p);
    // }
    return axios.post(baseUrl, formData, config)
            .then((response) => {
                return response
            }).catch((error) => {
                console.log('error occured', error)
            });
}

export default { upload }