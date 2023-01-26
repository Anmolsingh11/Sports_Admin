import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventsBySportName } from "../../../API/Events";
import Footer from "../../Footer";
import Navbar from "../../Navbar";

const Events = () => {
    const { sportName } = useParams();
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = React.useState([]);
    useEffect(() => {
        setLoading(true);
        getEventsBySportName({ sportName }).then((res) => {
            setEvents(res.data.events);
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        });
    }, [])
    const navigate = useNavigate();
    return (
        <>
            <Navbar />
            <p className="mt-3 fw-bold mx-3">Events</p>
            {loading
                ?
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
                :
                events?.length > 0 ? events.map((item, index) => (
                    <div className="card mx-3 mt-3" key={index} onClick={() => navigate(`/event-detail/${item._id}`)} style={{ borderRadius: '20px', boxShadow: '0px 2px 4px 2px #eee' }}>
                        <div className="card-body" style={{padding: "0.5rem 0.5rem"}}>
                            <p className="text-center h5">{item.eventName}</p>
                            <div className="container-fluid" style={{paddingLeft:'0px'}}>

                                {item.eventType === "MultiPlayer"
                                    ?
                                    <div className="row">
                                        <div className="col-5 d-flex">
                                            <img
                                                src={item.playerName[0]?.logo}
                                                alt="TeamAlogo"
                                                style={{width:'1.875rem', height:'1.875rem'}}
                                            />
                                            <p
                                                style={{ marginLeft: "15px" }}
                                                className="pt-2 mb-0"
                                            >
                                                {item.eventName}
                                            </p>
                                        </div>
                                    </div>
                                    :
                                    item.eventType === "Team"
                                        ?
                                        <div className="row">
                                            <div className="col-5 d-flex">
                                                <img src={item?.teamName[0]?.logo} alt="TeamALogo" style={{width:'1.875rem', height:'1.875rem'}} />
                                                <p style={{ marginLeft: '15px' }} className="pt-2 mb-0">{item?.teamName[0]?.teamName}</p>
                                            </div>
                                            <div className="col-2 pt-2">VS</div>
                                            <div className="col-5 d-flex float-right">
                                                <p style={{ marginRight: '15px' }} className="pt-2 mb-0">{item?.teamName[1]?.teamName}</p>
                                                <img src={item?.teamName[1]?.logo} alt="TeamBLogo" style={{width:'1.875rem', height:'1.875rem'}} />
                                            </div>
                                        </div>
                                        :
                                        item.eventType === "Player"
                                            ?
                                            <div className="row">
                                                <div className="col-5 d-flex">
                                                    <img src={item?.playerName[0]?.image} alt="Playerlogo" style={{width:'1.875rem', height:'1.875rem'}} />
                                                    <p style={{ marginLeft: '15px' }} className="pt-2 mb-0">{item?.playerName[0]?.name}</p>
                                                </div>
                                                <div className="col-2 pt-2">VS</div>
                                                <div className="col-5 d-flex float-right">
                                                    <p style={{ marginRight: '15px' }} className="pt-2 mb-0">{item?.playerName[1]?.name}</p>
                                                    <img src={item?.playerName[1]?.image} alt="Playerlogo " style={{width:'1.875rem', height:'1.875rem'}} />
                                                </div>
                                            </div>
                                            :
                                            ""}
                            </div>
                            <p className="text-center m-0 p-0">{item.date.split("-").reverse().join("-")} || {item.time} <br/> {item.venue} </p>
                        </div>
                    </div>
                )) : <h3 className="text-center mt-4 pt-4">No Event Exist!</h3>
            }
            <Footer />
        </>
    )
}

export default Events;