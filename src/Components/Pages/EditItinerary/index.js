import Navbar from "../../Navbar";
import Footer from "../../Footer";
import { useEffect, useState } from "react";
import { getAllEvents } from "../../../API/Events";
import { createItinerary, getItineraryByID, updateItinerary } from "../../../API/Itinerary";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
const EditItinerary = () => {
    const {id} = useParams();
    
    const [events, setEvents] = useState([]);
    const [eventName, setEventName]= useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [venue, setVenue] = useState("");

    useEffect(()=>{
        getItineraryByID(id).then((res)=>{
            if(res.data.itinerary.length > 0){
                const itinerary = res.data.itinerary[0];
                setEventName(itinerary.eventName[0]);
                setDate(itinerary.date.split("/").reverse().join("-"));
                setTime(convertTo24Hour(itinerary.time));
                setVenue(itinerary.venue);
            }
        }).catch((err)=>{console.log(err)});
    },[id]);

    function convertTo24Hour(time) {
        var hours = parseInt(time.substr(0, 2));
        if(time.indexOf('am') != -1 && hours == 12) {
            time = time.replace('12', '0');
        }
        if(time.indexOf('am') != -1 && hours < 10) {
            time = time.replace(hours, '0'+hours);
        }
        if(time.indexOf('pm')  != -1 && hours < 12) {
            time = time.replace(hours, (hours + 12));
        }
        return time.replace(/(am|pm)/, '');
      }

    useEffect(()=>{
        getAllEvents().then((res)=>{
            setEvents(res.data.events);
        }).catch((err)=>{
            console.log(err);
        })
    },[]);

    const handleSubmit = () =>{
        const reqBody = {
            time,
            date,
            venue,
            event:eventName
        }
        updateItinerary(reqBody).then((res)=>{
            console.log(res)
            toast.success("Itinerary has been updated successfully")
        }).catch((err)=>{
            toast.error("Some error occured");
        })
    }
    return (
        <>
            <Navbar />
            <div className="mt-3 mx-3" >
                    <p><b>Create Itinerary</b></p>
                    <input className="form-control mb-3" value={date} type={"date"} onChange={(e) => setDate(e.target.value)}/>
                    <input className="form-control mb-3" value={time} type={"time"} onChange={(e) => setTime(e.target.value)}/>
                    <input className="form-control mb-3" value={venue} placeholder="Venue" onChange={(e)=>setVenue(e.target.value)}/>
                    <input className="form-control mb-3" onChange={(e)=>setEventName(e.target.value)} />
                    
                    {/* <select className="form-control mb-3" onChange={(e)=> setEventName(e.target.value)}>
                        <option disabled selected>Event</option>
                        {events.map((item,index) => (
                            <option key={index} value={item._id} selected={eventName === item._id}>{item.eventName}</option>
                        ))}
                    </select> */}
                    <button className="btn btn-dark w-100" onClick={handleSubmit}>Update</button>
            </div>
            <Footer/>
        </>
    );
}

export default EditItinerary;