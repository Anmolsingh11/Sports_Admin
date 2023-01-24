import { useNavigate } from "react-router-dom";

const Footer = () =>{
    const navigate = useNavigate();
    return(
        // <div className="card header sticky-footer" style={{borderRadius: "20px 20px 0px 0px"}}>
        //     <div className="card-body">
        //         <div className="container-fluid">
        //             <div className="row">
        //                 <div className="col-6 d-flex justify-content-center">
        //                     <img src={"/Images/donut_largehome.svg"} alt={"go to home"} onClick={() => {navigate("/home"); if(document.getElementById("sportsContainer")){
        //                         document.getElementById("sportsContainer").scrollTo(0,0);
        //                     }}}/>
        //                 </div>
        //                 <div className="col-6 d-flex justify-content-center">
        //                     <img src={"/Images/Vectoritinerary.svg"} alt={"itinerary"}
        //                      onClick={() => navigate("/itinerary")}
        //                      />
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <></>
    );
}

export default Footer;