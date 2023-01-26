import axios from "axios"

export const addLeaderboard = (reqBody) =>{
    return axios.patch(`${process.env.REACT_APP_BASE_URL}/leaderboard/add-team-to-leaderboard`,reqBody);
}