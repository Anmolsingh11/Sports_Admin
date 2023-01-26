import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { uploadImage } from "../../../API/Common";
import { sports } from "../../../Assets/Data/sports";
import Footer from "../../Footer";
import Navbar from "../../Navbar";
import Multiselect from 'multiselect-react-dropdown';
import { createTeam, getAllTeams } from '../../../API/Team';
import { getPlayersBySport } from "../../../API/Player";

const CreateTeam = () => {
    const [autoIncrementedTeamID, setAutoIncrementedTeamID] = useState(0);
    const [players, setPlayers] = useState([]);
    const [name, setName] = useState("");
    const [logo, setLogo] = useState("");
    const [sport, setSport] = useState();
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    useEffect(() => {
        loadAllTeams();
    }, []);

    const loadAllTeams = () => {
        getAllTeams().then((res) => {
            setAutoIncrementedTeamID(res.data.teams.length + 1);
        }).catch((err) => { console.log(err) })
    }

    const handleImageUpload = (e) => {
        let files = e.target.files;
        for (var i = 0; i < files.length; i++) {
            let data = new FormData();
            data.append("file", files[i]);
            uploadImage(data).then((res) => {
                setLogo(res.data.imagesKey[0]);
                toast.success("Image has been uploaded");
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    const handleSubmit = () => {
        const reqBody = {
            teamId: autoIncrementedTeamID,
            teamName: name,
            logo,
            sport,
            player: selectedPlayers
        }
        createTeam(reqBody).then((res) => {
            toast.success("team has been created successfully");
            loadAllTeams();
            setName("");
            setLogo("");
            setSport("");
            setSelectedPlayers([]);
        }).catch((err) => {
            console.log(err);
            toast.error("error occured while creating team");
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

    const handleChange = (e) => {
        setSport(e.target.value);
        getPlayersBySport(e.target.value).then((res) => {
            setPlayers(res.data.players);
        }).catch((err) => { console.log(err) });
    }
    return (
        <>
            <Navbar />
            <div className="mx-3">
                <p className="fw-bold mt-3">Create Team</p>
                <input className="form-control box-shadow mb-3" placeholder="Tead ID" value={autoIncrementedTeamID} disabled />
                <input className="form-control box-shadow mb-3" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                <label for="file-upload" className="form-control mb-3">
                    Logo
                </label>
                <input id="file-upload" type="file" className="form-control box-shadow mb-3" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                {/* <select className="form-control mb-3" onChange={handleChange}>
                    <option>Sports</option>
                    {sports.map((item, index) => (
                        <option key={index}>{item.name}</option>
                    ))}
                </select> */}

                <Multiselect
                    className="mb-3"
                    options={players}
                    onSelect={handleAddPlayers}
                    onRemove={handleRemovePlayers}
                    displayValue="name"
                    placeholder="Players"
                />

                <button className="btn btn-dark w-100" onClick={handleSubmit}>Create</button>
            </div>
            <Footer />
        </>
    )
}

export default CreateTeam;