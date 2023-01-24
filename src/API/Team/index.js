import axios from "axios"

export const createTeam = (reqBody) =>{
    return axios.post(`${process.env.REACT_APP_BASE_URL}/team/add-team`,reqBody);
}

export const getAllTeams = () =>{
    return axios.get(`${process.env.REACT_APP_BASE_URL}/team/all-teams`);
}

export const getAutoincrementedTeamID = () =>{
    return axios.post(`${process.env.REACT_APP_BASE_URL}`);
}