import Navbar from "../../Navbar";
import Footer from "../../Footer";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sports } from "../../../Assets/Data/sports";
import { getAllTeams } from "../../../API/Team";
import { addLeaderboard } from "../../../API/LeaderBoard";

const AddLeaderboard = () => {
    const [sportName, setSportName] = useState("");
    const [teamName, setTeamName]= useState("");
    const [position, setPosition] = useState("");
    const [points, setPoints] = useState("");
    const [teams, setTeams] = useState([]);

    useEffect(()=>{
        getAllTeams().then((res)=>{
            setTeams(res.data.teams);
        }).catch((err)=>{
            console.log(err);
        })
    },[]);


    const handleSubmit = () =>{
        const reqBody = {
            sport: sportName,
            teamName,
            position,
            points
        }
        addLeaderboard(reqBody).then((res)=>{
            console.log(res)
            toast.success("Leaderboard has been created successfully")
        }).catch((err)=>{
            toast.error("Some error occured");
        })
    }
    return (
        <>
            <Navbar />
            <div className="mt-3 mx-3" >
                    <p><b>Create Leaderboard</b></p>
                    <select className="form-control mb-3" onChange={(e)=>setSportName(e.target.value)}>
                        <option>Select Sport</option>
                        {sports.map((item,index)=>(
                            <option key={index}>{item.name}</option>
                        ))}
                    </select>
                    <select className="form-control mb-3" onChange={(e)=>setTeamName(e.target.value)}>
                        <option>Select Team</option>
                        {teams.map((item,index)=>(
                            <option key={index}>{item.teamName}</option>
                        ))}
                    </select>
                    <select className="form-control mb-3" onChange={(e) => setPosition(e.target.value)}>
                        <option>Select Position</option>
                        <option value={"winner"}>Winner</option>
                        <option value={"runner up"}>Runner up</option>
                    </select>
                    <input className="form-control mb-3" placeholder="Points" onChange={(e)=>setPoints(e.target.value)}/>
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

export default AddLeaderboard;