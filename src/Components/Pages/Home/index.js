import Navbar from "../../Navbar";
import Footer from "../../Footer";
import { useNavigate } from "react-router-dom";
import { sports } from "../../../Assets/Data/sports";
const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div>
                <div id="sportsContainer" className="container-fluid mt-5" 
                // style={{ maxHeight: '100vh', height: '80vh', overflow: 'scroll' }}
                style={{paddingBottom: '20%', paddingTop: '10%'}}
                >
                    <div className="row">
                        {sports.map((item, index) => (
                            <div className="col-4" key={index}>
                                <div className="card my-3 card-border" onClick={() => navigate(`/events/${item.name}`)} style={{ width: '100px', height: '100px' }}>
                                    <div className="card-body d-flex justify-content-center">
                                        {item.Icon === ""
                                            ?
                                            <p style={{ fontSize: '1rem', textAlign: 'center'}}>{item.name}</p>
                                            :
                                            <img src={`${item.Icon}`} alt={item.name} width={"45px"} height={"45px"} />
                                        }
                                    </div>
                                    <div className="footer">
                                        {item.Icon !== ""
                                            ?
                                            <p style={{ fontSize: '12px', textAlign: 'center' }}>{item.name}</p>
                                            :
                                            ""
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Home;