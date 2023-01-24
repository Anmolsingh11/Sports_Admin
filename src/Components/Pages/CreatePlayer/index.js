import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadImage } from "../../../API/Common";
import { addPlayer, getAutoIncrementedValue } from "../../../API/Player";
import { sports } from "../../../Assets/Data/sports";
import Footer from "../../Footer";
import Navbar from "../../Navbar";

const CreatePlayer = () => {
    const navigate = useNavigate();
    const [autoPlayerID, setAutoPlayerID] = useState(0);
    const [playerId, setPlayerId] = useState('')
    const [sport, setSport] = useState('')
    const [age, setAge] = useState('');
    const [selectSport, setSelectSports] = useState('')
    const [gender, setGender] = useState('')
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState('');

    useEffect(() => {
        getAllPlayers();
    }, []);

    const getAllPlayers = () => {
        getAutoIncrementedValue().then((res) => {
            if (res.data.length > 0) {
                setAutoPlayerID(res.data[0].playerId + 1);
            } else {
                setAutoPlayerID(res.data.length + 1);
            }
        })
    }

    const handleImageUpload = (e) => {
        let files = e.target.files;
        for (var i = 0; i < files.length; i++) {
            let data = new FormData();
            data.append("file", files[i]);
            uploadImage(data).then((res) => {
                setPhoto(res.data.imagesKey[0]);
                toast.success("Image has been uploaded");
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    const handleSubmit = async () => {
        const reqBody = {
            playerId: autoPlayerID, name, age, gender, image:photo, sports: selectSport
        }
        addPlayer(reqBody).then((res) => {
            if (res.status) {
                toast.success(res.data.message)
                setName("");
                setSelectSports("");
                setPhoto("");
                setGender("");
                setAge("");
                getAllPlayers();

            }
            else {
                toast.error(res.data.message)
            }
        })
            .catch((err) => {
                toast.error(err.response.data.message)
            })
    }
    return (
        <>
            <Navbar />
            <div className="mx-3">
                <p className="fw-bold mt-3">Create Player</p>
                <input className="form-control box-shadow mb-3" placeholder="Player Id" disabled value={autoPlayerID} onChange={(e) => setPlayerId(e.target.value)} />
                <input className="form-control box-shadow mb-3" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <label for="file-upload" className="form-control mb-3">
                    Photo
                </label>
                <input id="file-upload" type="file" className="form-control box-shadow mb-3" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                <select className="form-control mb-3" onChange={(e) => setSelectSports(e.target.value)}>
                    <option disabled selected={selectSport === ""}>Sports</option>
                    {sports.map((item, index) => (
                        <option key={index}>{item.name}</option>
                    ))}
                </select>
                <input className="form-control box-shadow mb-3" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
                {/* <input className="form-control box-shadow mb-3" placeholder="Gender" value={gender} onChange={(e)=>setGender(e.target.value)} /> */}
                <select className="form-control box-shadow mb-3" onChange={(e) => setGender(e.target.value)}>
                    <option disabled selected>Gender</option>
                    <option value={"male"}>Male</option>
                    <option value={"female"}>Female</option>
                </select>
                <button className="btn btn-dark w-100" onClick={handleSubmit}>Create</button>
            </div>
            <Footer />
        </>
    )
}

export default CreatePlayer;