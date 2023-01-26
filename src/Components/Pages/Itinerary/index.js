import Navbar from "../../Navbar";
import Footer from "../../Footer";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getItineraryByDate } from "../../../API/Itinerary";
const Itinerary = () => {
    const [itineraries, setItineraries] = useState([])
    useEffect(() => {
        getItineraryByDate({ date: "" }).then((res) => {
            setItineraries(res.data.Itineraries);
            console.log(res.data.Itineraries);
            setItineraries(res.data.Itineraries);
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    const navigate = useNavigate();
    return (
        <>
            <Navbar />
            <div className="card mt-3 mx-3" style={{ borderRadius: '15px', boxShadow: '0px 2px 4px 2px #eee' }}>
                <div className="card-body">
                    <p>
                        Itinerary
                        <Link className="btn btn-dark" title="Add Itinerary" style={{ float: 'right' }} to="/itinerary-add">
                            <i className="fa-regular fa-plus"></i>
                        </Link>
                    </p>
                    <div className="container-fluid">
                        {
                            itineraries.map((item, index) => (
                                <>
                                    <p>{item._id}</p>
                                    <>
                                        {
                                            item.Itineraries.map((itinerary, i) => (
                                                <div className="row">
                                                    <div className="col-4">
                                                        <p>{itinerary.time}</p>
                                                    </div>
                                                    <div className="col-6">
                                                        <p>{itinerary.eventName} <br /> {itinerary.venue}</p>
                                                    </div>
                                                    <div className="col-2">
                                                        <span className="btn btn-dark" onClick={() => navigate(`/itinerary/update/${itinerary._id}`)}><i className="fa-solid fa-pen"></i></span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </>
                                </>
                            ))
                        }
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
}

export default Itinerary;