import axios from "axios"

export const uploadImage = (data) =>{
    return axios.post('https://backend.nirikshan.co/upload/upload-image',data);
}