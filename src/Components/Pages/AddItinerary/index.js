import Navbar from "../../Navbar";
import Footer from "../../Footer";
import { useEffect, useState } from "react";
import { getAllEvents } from "../../../API/Events";
import { createItinerary } from "../../../API/Itinerary";
import { toast } from "react-toastify";
const AddItinerary = () => {
    const [events, setEvents] = useState([]);
    const [eventName, setEventName]= useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [venue, setVenue] = useState("");

    useEffect(()=>{
        getAllEvents().then((res)=>{
            console.log(res);
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
        createItinerary(reqBody).then((res)=>{
            console.log(res)
            toast.success("Itinerary has been created successfully")
        }).catch((err)=>{
            toast.error("Some error occured");
        })
    }
    return (
        <>
            <Navbar />
            <div className="mt-3 mx-3" >
                    <p><b>Create Itinerary</b></p>
                    <input className="form-control mb-3" type={"date"} onChange={(e) => setDate(e.target.value)}/>
                    <input className="form-control mb-3" type={"time"} onChange={(e) => setTime(e.target.value)}/>
                    <input className="form-control mb-3" placeholder="Venue" onChange={(e)=>setVenue(e.target.value)}/>
                    <input className="form-control mb-3" onChange={(e)=>setEventName(e.target.value)} />
                    {/* <select className="form-control mb-3" onChange={(e)=> setEventName(e.target.value)}>
                        <option disabled selected>Event</option>
                        {events.map((item) => (
                            <option value={item._id}>{item.eventName}</option>
                        ))}
                    </select> */}
                    <button className="btn btn-dark w-100" onClick={handleSubmit}>Create</button>
            </div>
            <Footer/>
        </>
    );
}

export default AddItinerary;