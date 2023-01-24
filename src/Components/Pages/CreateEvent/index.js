import { createEvent, getAllEvents } from "../../../API/Events/index";
import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllPlayers, getPlayersBySport } from "../../../API/Player";
import { getAllTeams } from "../../../API/Team";
import Footer from "../../Footer";
import Navbar from "../../Navbar";
import { sports } from "../../../Assets/Data/sports";

const CreateEvent = () => {
    const [autoIncreamentEventID, setAutoIncrementEventID] = useState(0);
    const [eventName, setEventName] = useState("");
    const [eventType, setEventType] = useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [venue, setVenue] = useState("");
    const [sportName, setSportName] = useState("");
    const [closeEvent, setClosedEvent] = useState("");
    const [teamA, setTeamA] = useState("");
    const [teamB, setTeamB] = useState("");
    const [playerA, setPlayerA] = useState("");
    const [playerB, setPlayerB] = useState("");
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        getAllTeams().then((res) => {
            setTeams(res.data.teams);
        }).catch((err) => console.log(err));

        getAllPlayers().then((res) => {
            setPlayers(res.data.users);
        }).catch((err) => console.log(err));

        loadAllEvents();
    }, []);

    const loadAllEvents = () => {
        getAllEvents().then((res) => {
            setAutoIncrementEventID(res.data.events.length + 1);
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleAddPlayers = (selectedList) => {
        let list = selectedList.map((item) => {
            return item._id
        });
        setSelectedPlayers(list);
    }

    const handleRemovePlayers = (selectedList) => {
        let list = selectedList.map((item) => {
            return item._id
        });
        setSelectedPlayers(list);
    }

    const handleCreateEvent = () => {
        let reqBody;
        if (eventType === "Team") {
            reqBody = {
                eventId: autoIncreamentEventID,
                sportName,
                eventName,
                eventType,
                time,
                date,
                venue,
                closeEvent,
                teamName: [teamA, teamB]
            }
        } else {
            reqBody = {
                eventId: autoIncreamentEventID,
                sportName,
                eventName,
                eventType,
                time,
                date,
                venue,
                closeEvent,
                playerName: eventType === "Player" ? [playerA, playerB] : eventType === "MultiPlayer" ? selectedPlayers : []
            }

        }

        createEvent(reqBody).then((res) => {
            toast.success("Event has been created successfully");
            loadAllEvents();
        }).catch((err) => {
            console.log(err);
        });
    }

    const handleChange = (e) => {
        setSportName(e.target.value);
        getPlayersBySport(e.target.value).then((res) => {
            setPlayers(res.data.players);
        }).catch((err) => { console.log(err) });
    }

    return (
        <>
            <Navbar />
            <div className="mx-3">
                <p className="fw-bold mt-3">Create Event</p>
                <input className="form-control mb-3" placeholder="Event ID" disabled value={autoIncreamentEventID} />
                <input className="form-control mb-3" placeholder="Event name" onChange={(e) => setEventName(e.target.value)} />

                <select className="form-control mb-3" onChange={handleChange}>
                    <option disabled selected>Sport</option>
                    {sports.map((item, index) => (
                        <option key={index}>{item.name}</option>
                    ))}
                </select>
                <select className="form-control mb-3" onChange={(e) => setEventType(e.target.value)}>
                    <option value={""} disabled selected>Event type</option>
                    <option value={"Team"}>team</option>
                    <option value={"Player"}>player</option>
                    <option value={"MultiPlayer"}>multiplayer</option>
                </select>

                {eventType === "Team"
                    ?
                    <>
                        <select className="form-control mb-3" onChange={(e) => { setTeamA(e.target.value) }}>
                            <option selected disabled>First Team</option>
                            {teams.map((item, index) => (
                                <option key={index} value={item._id}>{item.teamName}</option>
                            ))}
                        </select>
                        <p className="text-center">Vs</p>
                        <select className="form-control mb-3" onChange={(e) => { setTeamB(e.target.value) }}>
                            <option disabled selected>Second Team</option>
                            {teams.map((item, index) => (
                                <option key={index} value={item._id}>{item.teamName}</option>
                            ))}
                        </select>
                    </>
                    :
                    eventType === "Player"
                        ?
                        <>
                            <select className="form-control mb-3" onChange={(e) => { setPlayerA(e.target.value) }}>
                                <option>Player A</option>
                                {players.map((item) => (
                                    <option value={item._id}>{item.name}</option>
                                ))}
                            </select>
                            <p className="text-center">Vs</p>
                            <select className="form-control mb-3" onChange={(e) => { setPlayerB(e.target.value) }}>
                                <option>Player B</option>
                                {players.map((item) => (
                                    <option value={item._id}>{item.name}</option>
                                ))}
                            </select>
                        </>
                        :
                        eventType === "MultiPlayer"
                            ?
                            <Multiselect
                                className="mb-3"
                                options={players}
                                onSelect={handleAddPlayers}
                                onRemove={handleRemovePlayers}
                                displayValue="name"
                                placeholder="Select Players"
                            />
                            :
                            ""
                }

                <input className="form-control mb-3" type={"date"} onChange={(e) => setDate(e.target.value)} />
                <input className="form-control mb-3" type={"time"} placeholder="Time" onChange={(e) => setTime(e.target.value)} />
                <input className="form-control mb-3" placeholder="Venue" onChange={(e) => setVenue(e.target.value)} />
                <input className="form-control mb-3" type={"date"} placeholder="Closed time" onChange={(e) => setClosedEvent(e.target.value)} />
                <button className="btn btn-dark w-100" onClick={handleCreateEvent}>Create</button>
            </div>
            <Footer />
        </>
    )
}

export default CreateEvent;