import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Login from "./Components/Pages/Login";
import Home from "./Components/Pages/Home";
import Events from "./Components/Pages/Events";
import CreatePlayer from "./Components/Pages/CreatePlayer";
import CreateTeam from "./Components/Pages/CreateTeam";
import CreateEvent from "./Components/Pages/CreateEvent";
import EventDetail from "./Components/Pages/EventDetail";
import Itinerary from "./Components/Pages/Itinerary";
import AddItinerary from "./Components/Pages/AddItinerary";
import EditItinerary from "./Components/Pages/EditItinerary";
import AddLeaderboard from "./Components/Pages/AddLeaderboard";
function App() {
  return (
    <>
    <ToastContainer/>
    <Routes>
      <Route exact path="/" element={<Login/>}/>
      <Route exact path="/home" element={<Home/>}/>
      <Route exact path="/events/:sportName" element={<Events/>}/>
      <Route exact path="/event-detail/:id" element={<EventDetail/>}/>
      <Route exact path="/create-player" element={<CreatePlayer/>}/>
      <Route exact path="/create-event" element={<CreateEvent/>}/>
      <Route exact path="/create-team" element={<CreateTeam/>}/>
      <Route exact path="/itinerary" element={<Itinerary/>}/>
      <Route exact path="/add-leaderboard" element={<AddLeaderboard/>} />
      <Route exact path="/itinerary/update/:id" element={<EditItinerary/>}/>
      <Route exact path="/itinerary-add" element={<AddItinerary/>}/>
    </Routes>
    </>
  );
}

export default App;
