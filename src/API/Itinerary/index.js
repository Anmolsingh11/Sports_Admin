import axios from "axios"

export const createItinerary = (reqBody) =>{
    return axios.post(`${process.env.REACT_APP_BASE_URL}/event/create-itinerary`,reqBody);
}

export const getAllItenerary = () =>{
    return axios.get(`${process.env.REACT_APP_BASE_URL}/event/get-all-itinerary`);
}

export const updateItinerary = (reqBody) =>{
    return axios.post(`${process.env.REACT_APP_BASE_URL}/event/edit-Itinerary`,reqBody);
}

export const getItineraryByID = (ID) =>{
    return axios.get(`${process.env.REACT_APP_BASE_URL}/event/get-itinerary-by-id/${ID}`);
}

export const getItineraryByDate = (reqBody) =>{
    return axios.post(`${process.env.REACT_APP_BASE_URL}/event/get-itineraries-by-date`,reqBody);
}
