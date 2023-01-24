import axios from "axios"

export const createEvent = (reqBody) =>{
    return axios.post(`${process.env.REACT_APP_BASE_URL}/event/create-event`,reqBody);
}

export const getAllEvents = () =>{
    return axios.get(`${process.env.REACT_APP_BASE_URL}/event/all-event`);
}


export const getEventsBySportName = (reqBody) =>{
    return axios.post(`${process.env.REACT_APP_BASE_URL}/event/get-event-by-sports`,reqBody);
}

export const getEventByID = (ID) =>{
    return axios.get(`${process.env.REACT_APP_BASE_URL}/event/get-event-by-id/${ID}`);
}

export const createAndUpdateScore = (reqBody) =>{
    return axios.post(`${process.env.REACT_APP_BASE_URL}/event/create-and-update-score`,reqBody);
}

export const getExtrasForTeam = (reqBody) => {
    return axios.post(`${process.env.REACT_APP_BASE_URL}/event/get-extras-by-event-and-team`,reqBody);
}

export const updateEventByID = (reqBody) => {
    return axios.patch(`${process.env.REACT_APP_BASE_URL}/event/update-event`,reqBody);
}