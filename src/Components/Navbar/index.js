import { Link } from "react-router-dom";

const Navbar = () => {

    /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
    function openNav() {
        document.getElementById("mySidebar").style.width = "100%";
        document.getElementById("main").style.display = "npne";
    }

    /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
    function closeNav() {
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.display = "block";
    }

    return (
        <>
            <div className="card header sticky-header" id="main" style={{ borderRadius: "0px 0px 20px 20px" }}>
                <div className="card-body">
                    <img src={"/Images/Hamburger.svg"} alt="navigate" onClick={openNav} />
                </div>
            </div>
            <div id="mySidebar" className="sidebar">
                <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
                <div className="mt-5 pt-5">
                    <Link to="/home" className="text-center">Home</Link>
                    <Link to="/itinerary" className="text-center">Itinerary</Link>
                    <Link to="/create-event" className="text-center">Event</Link>
                    <Link to="/create-team" className="text-center">Team</Link>
                    <Link to="/create-player" className="text-center">Player</Link>
                </div>
            </div>
        </>
    );
}

export default Navbar;