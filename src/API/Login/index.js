import axios from "axios"

export const logIn = (username,password) =>{
    return axios.post(`${process.env.REACT_APP_BASE_URL}/auth/admin-login`,{email:username,password});
}