import axios from "axios"

export const addPlayer = async(reqBody) =>{
    return await axios.post(`${process.env.REACT_APP_BASE_URL}/player/add-player`,{...reqBody});
}

export const getAllPlayers = async() =>{
    return await axios.get(`${process.env.REACT_APP_BASE_URL}/player/all-players`);
}

export const getPlayersBySport = async(sportName) =>{
    return await axios.get(`${process.env.REACT_APP_BASE_URL}/player/get-player-by-sport/${sportName}`);
}

export const getAutoIncrementedValue = async() =>{
    return await axios.get(`${process.env.REACT_APP_BASE_URL}/player/check-player-id`);
}

export const getPlayerByID = async(ID) =>{
    return await axios.get(`${process.env.REACT_APP_BASE_URL}/player/get-player-by-id/${ID}`);
}