import { useEffect, useState } from "react";
import Footer from "../../Footer";
import Navbar from "../../Navbar";
import Pusher from "pusher-js";
import { createAndUpdateScore, getEventByID, getExtrasForTeam, updateEventByID } from "../../../API/Events";
import { useNavigate, useParams } from "react-router-dom";
import { getPlayerByID } from "../../../API/Player";
import { toast } from "react-toastify";

const EventDetail = () => {
  const [loading, setLoading] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [eventDetail, setEventDetail] = useState();
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [players, setPlayers] = useState([]);
  const [playerA, setPlayerA] = useState();
  const [playerB, setPlayerB] = useState();
  const [teamAExtras, setTeamAExtras] = useState(0);
  const [teamBExtras, setTeamBExtras] = useState(0);
  const [selectedTeam, setSeletedTeam] = useState("");
  const [winner, setWinner] = useState("");
  const [playermarkedforOut, setPlayerMarkedForOut] = useState("");

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    getEventByID(id)
      .then((res) => {
        setEventDetail(res.data.message[0]);
        if (res.data.message[0].eventType === "MultiPlayer") {
          console.log(
            "here are your players",
            res.data.message[0].playerName.map((item) => {
              return { ...item, score: 0 };
            })
          );
          setPlayers(
            res.data.message[0].playerName.map((item) => {
              return { ...item, score: 0 };
            })
          );
        } else if (res.data.message[0].eventType === "Team") {
          let playerA = [];
          res.data.message[0].teamName[0].player.map((item) => {
            playerA.push({ ...item, score: 0, isOut: false });
          });
          console.log("Here is your profile", playerA);
          setTeamA((oldArr) => [...oldArr, ...playerA]);

          // get players for team B
          let playerB = [];
          res.data.message[0].teamName[1].player.map((item) => {
            playerB.push({ ...item, score: 0, isOut: false });
          });
          console.log("Here is your profile B", playerB);
          setTeamB((oldArr) => [...oldArr, ...playerB]);
        } else if (res.data.message[0].eventType === "Player") {
          setPlayerA({ ...res.data.message[0].teamName[0], score: 0 });
          setPlayerB({ ...res.data.message[0].teamName[1], score: 0 });
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    if (eventDetail) {
      if (eventDetail.eventType === "Team") {
        getExtrasForTeam({ teamId: eventDetail.teamName[0]._id, eventId: id }).then((res) => {
          let data = teamA.map(obj1 => {
            const matchingObj = res.data.scores.find(obj2 => obj2.player === obj1._id);
            if (matchingObj) {
              return { ...obj1, score: matchingObj.score, isOut: matchingObj.isOut };
            }
            return obj1;
          });
          if (data.length > 0) {
            setTeamA(data);
          }
        }).catch((err) => console.log(err));

        getExtrasForTeam({ teamId: eventDetail.teamName[1]._id, eventId: id }).then((res) => {
          let data = teamB.map(obj1 => {
            const matchingObj = res.data.scores.find(obj2 => obj2.player === obj1._id);
            if (matchingObj) {
              return { ...obj1, score: matchingObj.score, isOut: matchingObj.isOut };
            }
            return obj1;
          });
          if (data.length > 0) {
            setTeamB(data);
          }
        }).catch((err) => console.log(err));
      }
      else if (eventDetail.eventType === "MultiPlayer") {
        if (players.length > 0 && eventDetail.playerName.length > 0) {
          getExtrasForTeam({ teamId: eventDetail.playerName[0]._id, eventId: id }).then((res) => {
            if (res.data.scores.length > 0) {
              let data = players.map(obj1 => {
                const matchingObj = res.data.scores.find(obj2 => obj2.player === obj1._id);
                if (matchingObj) {
                  return { ...obj1, score: matchingObj.score };
                }
                return obj1;
              });
              if (data.length > 0) {
                setPlayers(data);
              }
            }
          });
        }
      } else if (eventDetail.eventType === "Player") {
        if (playerA && eventDetail.teamName.length > 0) {
          getExtrasForTeam({ teamId: eventDetail.teamName[0]._id, eventId: id }).then((res) => {
            if (res.data.scores.length > 0) {
              const matchingObj = res.data.scores.find(obj2 => obj2.player === playerA._id);
              let data = { ...playerA, score: matchingObj.score };
              if (data.length > 0) {
                setPlayerA(data);
              }
            }
          });
        }
  
        if (playerB && eventDetail.teamName.length > 1) {
          getExtrasForTeam({ teamId: eventDetail.teamName[1]._id, eventId: id }).then((res) => {
            if (res.data.scores.length > 0) {
              const matchingObj = res.data.scores.find(obj2 => obj2.player === playerB._id);
              let data = { ...playerB, score: matchingObj.score };
              if (data.length > 0) {
                setPlayerB(data);
              }
            }
          });
        }
      }
    }
  }, [id, eventDetail]);

  const handleAddScore = (index) => {
    //update event 
    if(eventDetail.status !== "active"){
      updateEventByID({ eventId: eventDetail._id, status: "active" }).then((res) => {

      }).catch((err) => console.log(err));
    }

    const updatedPlayers = [...teamA];
    let score = updatedPlayers[index].score++;
    setTeamA(updatedPlayers);
    setSeletedTeam(eventDetail.teamName[0]._id);
    const reqBody = {
      eventId: eventDetail._id,
      gameType: eventDetail.eventType,
      playerId: updatedPlayers[index]._id,
      teamId: eventDetail.teamName[0]._id,
      score: score + 1,
    };

    createAndUpdateScore(reqBody)
      .then((res) => { })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleReduceScore = (index) => {

    if(eventDetail.status !== "active"){
      updateEventByID({ eventId: eventDetail._id, status: "active" }).then((res) => {

      }).catch((err) => console.log(err));
    }

    const updatedPlayers = [...teamA];
    if (updatedPlayers[index].score >= 1) {
      let score = updatedPlayers[index].score--;
      setTeamA(updatedPlayers);
      setSeletedTeam(eventDetail.teamName[1]._id);

      const reqBody = {
        eventId: eventDetail._id,
        gameType: eventDetail.eventType,
        playerId: updatedPlayers[index]._id,
        teamId: eventDetail.teamName[0]._id,
        score: score - 1,
      };

      createAndUpdateScore(reqBody)
        .then((res) => { })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAddScoreTeamB = (index) => {

    if(eventDetail.status !== "active"){
      updateEventByID({ eventId: eventDetail._id, status: "active" }).then((res) => {

      }).catch((err) => console.log(err));
    }

    const updatedPlayers = [...teamB];
    let score = updatedPlayers[index].score++;
    setTeamB(updatedPlayers);

    const reqBody = {
      eventId: eventDetail._id,
      gameType: eventDetail.eventType,
      playerId: updatedPlayers[index]._id,
      teamId: eventDetail.teamName[1]._id,
      score: score + 1,
    };

    createAndUpdateScore(reqBody)
      .then((res) => {
        console.log("Updated score", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleReduceScoreTeamB = (index) => {

    if(eventDetail.status !== "active"){
      updateEventByID({ eventId: eventDetail._id, status: "active" }).then((res) => {

      }).catch((err) => console.log(err));
    }

    const updatedPlayers = [...teamB];
    if (updatedPlayers[index].score >= 1) {
      let score = updatedPlayers[index].score--;
      setTeamB(updatedPlayers);

      const reqBody = {
        eventId: eventDetail._id,
        gameType: eventDetail.eventType,
        playerId: updatedPlayers[index]._id,
        teamId: eventDetail.teamName[1]._id,
        score: score - 1,
      };

      createAndUpdateScore(reqBody)
        .then((res) => {
          console.log("Updated score", res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAddScoreMultiPlayer = (index) => {

    if(eventDetail.status !== "active"){
      updateEventByID({ eventId: eventDetail._id, status: "active" }).then((res) => {

      }).catch((err) => console.log(err));
    }

    const updatedPlayers = [...players];
    let score = updatedPlayers[index].score++;
    setPlayers(updatedPlayers);

    const reqBody = {
      eventId: eventDetail._id,
      gameType: eventDetail.eventType,
      playerId: updatedPlayers[index]._id,
      teamId: eventDetail.playerName[0]._id,
      score: score + 1,
    };

    createAndUpdateScore(reqBody)
      .then((res) => {
        console.log("Updated score", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleReduceScoreMultiPlayer = (index) => {

    if(eventDetail.status !== "active"){
      updateEventByID({ eventId: eventDetail._id, status: "active" }).then((res) => {

      }).catch((err) => console.log(err));
    }

    const updatedPlayers = [...players];
    if (updatedPlayers[index].score >= 1) {
      let score = updatedPlayers[index].score--;
      setPlayers(updatedPlayers);

      const reqBody = {
        eventId: eventDetail._id,
        gameType: eventDetail.eventType,
        playerId: updatedPlayers[index]._id,
        teamId: eventDetail.playerName[0]._id,
        score: score - 1,
      };

      createAndUpdateScore(reqBody)
        .then((res) => {
          console.log("Updated score", res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleReduceScorePlayerA = () => {

    if(eventDetail.status !== "active"){
      updateEventByID({ eventId: eventDetail._id, status: "active" }).then((res) => {

      }).catch((err) => console.log(err));
    }

    const updatedPlayer = { ...playerA };
    if (updatedPlayer.score >= 1) {
      let score = updatedPlayer.score--;
      console.log("Here is darta", updatedPlayer);
      setPlayerA(updatedPlayer);

      const reqBody = {
        eventId: eventDetail._id,
        gameType: eventDetail.eventType,
        playerId: updatedPlayer._id,
        teamId: eventDetail.teamName[0]._id,
        score: score - 1,
      };

      createAndUpdateScore(reqBody)
        .then((res) => {
          console.log("Updated score", res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAddScorePlayerA = () => {

    if(eventDetail.status !== "active"){
      updateEventByID({ eventId: eventDetail._id, status: "active" }).then((res) => {

      }).catch((err) => console.log(err));
    }

    const updatedPlayer = { ...playerA };
    let score = updatedPlayer.score++;
    console.log("Here is updated player", updatedPlayer);
    setPlayerA(updatedPlayer);

    const reqBody = {
      eventId: eventDetail._id,
      gameType: eventDetail.eventType,
      playerId: updatedPlayer._id,
      teamId: eventDetail.teamName[0]._id,
      score: score + 1,
    };

    createAndUpdateScore(reqBody)
      .then((res) => {
        console.log("Updated score", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleReduceScorePlayerB = () => {

    if(eventDetail.status !== "active"){
      updateEventByID({ eventId: eventDetail._id, status: "active" }).then((res) => {

      }).catch((err) => console.log(err));
    }


    const updatedPlayer = { ...playerB };
    if (updatedPlayer.score >= 1) {
      let score = updatedPlayer.score--;
      console.log("Here is darta", updatedPlayer);
      setPlayerB(updatedPlayer);

      const reqBody = {
        eventId: eventDetail._id,
        gameType: eventDetail.eventType,
        playerId: updatedPlayer._id,
        teamId: eventDetail.teamName[0]._id,
        score: score - 1,
      };

      createAndUpdateScore(reqBody)
        .then((res) => {
          console.log("Updated score", res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAddScorePlayerB = () => {

    if(eventDetail.status !== "active"){
      updateEventByID({ eventId: eventDetail._id, status: "active" }).then((res) => {

      }).catch((err) => console.log(err));
    }

    const updatedPlayer = { ...playerB };
    let score = updatedPlayer.score++;
    console.log("Here is updated player", updatedPlayer);
    setPlayerB(updatedPlayer);

    const reqBody = {
      eventId: eventDetail._id,
      gameType: eventDetail.eventType,
      playerId: updatedPlayer._id,
      teamId: eventDetail.teamName[0]._id,
      score: score + 1,
    };

    createAndUpdateScore(reqBody)
      .then((res) => {
        console.log("Updated score", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (eventDetail) {
      getExtrasForTeam(eventDetail.teamName[0]._id).then((res) => {
        setTeamAExtras(res.data.scores);
      })

      getExtrasForTeam(eventDetail.teamName[1]._id).then((res) => {
        setTeamBExtras(res.data.scores);
      })
    }
  }, []);

  const handleAddExtras = () => {
    if (selectedTeam === "") {
      toast.warn("please select a team by adding some score");
    } else {
      getExtrasForTeam({ eventId: eventDetail._id, teamId: selectedTeam }).then((res) => {
        console.log(res);
        if (selectedTeam === eventDetail.teamName[0]._id) {
          console.log("yoo");
          setTeamAExtras(teamAExtras + 1);
        } else {
          setTeamBExtras(teamBExtras + 1);
        }
        const reqBody = {
          eventId: eventDetail._id,
          extras: {
            eventId: eventDetail._id,
            teamId: selectedTeam,
            count: teamAExtras + 1
          },
          teamId: selectedTeam,
        }

        createAndUpdateScore(reqBody).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        })
      })
    }
  }

  const navigate = useNavigate();

  const handleCloseEvent = () => {
    console.log(JSON.parse(winner));
    let reqBody = {
      eventId: eventDetail._id,
      status: "closed",
      winner: [JSON.parse(winner)]
    }
    updateEventByID(reqBody).then((res) => {
      console.log(res);
      navigate("/home");
    }).catch((err) => {
      console.log(err);
    })

  }

  const handleWinner = () => {
    if (window.confirm("Are you sure, you want to end this event")) {
      if (eventDetail.eventType === "MultiPlayer") {
        setWinner(eventDetail.teamName[0]);
      } else if (eventDetail.eventType === "Player") {
        setWinner(eventDetail.teamName[0]);
      } else if (eventDetail.eventType === "Team") {
        setWinner(eventDetail.teamName[0]);
      }
    }
  }

  const handleOut = () => {
    const reqBody = {
      eventId: eventDetail._id,
      gameType: eventDetail.eventType,
      playerId: JSON.parse(playermarkedforOut).playerID,
      teamId: JSON.parse(playermarkedforOut).teamID,
      isOut: true,
    };

    createAndUpdateScore(reqBody).then((res) => {
      toast.success("Player has been out");
    }).catch((err) => { console.log(err) });
  }

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="d-flex justify-content-center mt-5 pt-5">
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      ) : (
        <>
          {eventDetail ? (
            <>
              <div
                className="card mt-3 mx-3"
                style={{
                  borderRadius: "20px",
                  boxShadow: "0px 2px 4px 2px #eee",
                }}
              >
                <div className="card-body" style={{padding: "0.5rem 0.5rem"}}>
                  <div className="container-fluid">
                    {eventDetail.eventType === "MultiPlayer" ? (
                      <div className="row">
                        <div className="col-5 d-flex">
                          <img
                            src={eventDetail?.teamName[0]?.logo}
                            alt="TeamAlogo"
                            width="1.875rem"
                            heigth="1.875rem"
                          />
                          <p
                            style={{ marginLeft: "15px" }}
                            className="pt-2 mb-0"
                          >
                            {eventDetail?.eventName}
                          </p>
                        </div>
                      </div>
                    ) : eventDetail.eventType === "Player" ? (
                      <div className="row">
                        <div className="col-5 d-flex">
                          <img src={eventDetail.playerName[0]?.image} alt="Playerlogo" style={{ width: '1.875rem', height: '1.875rem' }} />
                          <p style={{ marginLeft: '15px' }} className="pt-2 mb-0">{eventDetail.playerName[0]?.name}</p>
                        </div>
                        <div className="col-2 pt-2">VS</div>
                        <div className="col-5 d-flex float-right">
                          <p style={{ marginRight: '15px' }} className="pt-2 mb-0">{eventDetail.playerName[1]?.name}</p>
                          <img src={eventDetail.playerName[1]?.image} alt="Playerlogo " style={{ width: '1.875rem', height: '1.875rem' }} />
                        </div>
                      </div>
                    ) : (
                      <div className="row">
                        <div className="col-5 d-flex">
                          <img
                            src={eventDetail?.teamName[0]?.logo}
                            alt="TeamAlogo"
                            style={{ width: '1.875rem', height: '1.875rem' }}
                          />
                          <p
                            style={{ marginLeft: "15px" }}
                            className="pt-2 mb-0"
                          >
                            {eventDetail?.teamName[0]?.teamName}
                          </p>
                        </div>
                        <div className="col-2 mt-3">VS</div>
                        <div className="col-5 d-flex float-right">
                          <p
                            style={{ marginRight: "15px" }}
                            className="pt-2 mb-0"
                          >
                            {eventDetail?.teamName[1]?.teamName}
                          </p>
                          <img
                            src={eventDetail?.teamName[1]?.logo}
                            alt="TeamBlogo"
                            style={{ width: '1.875rem', height: '1.875rem' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-center mt-2 p-0">
                    {eventDetail.date} || {eventDetail.time} <br />
                    {eventDetail.venue}{" "}
                  </p>
                  <p className="mt-2">
                    Winner:{" "}
                    <span style={{ marginLeft: "35px" }}>
                      {eventDetail.winner.length === 0
                        ? "TBA"
                        : eventDetail.winner[0].name != undefined ? eventDetail.winner[0].name : eventDetail.winner[0].teamName}
                    </span>
                  </p>
                </div>
              </div>
              <div
                className="card mt-3 mx-3"
                style={{
                  borderRadius: "20px",
                  boxShadow: "0px 2px 4px 2px #eee",
                }}
              >
                <div className="card-body" style={{padding: "0.5rem 0.5rem"}}>
                  {eventDetail.eventType === "MultiPlayer" ? (
                    players.map((item, index) => (
                      <p key={index}>
                        {item.name}
                        <span style={{ float: "right" }}>
                          <button
                            style={{
                              backgroundColor: "#000",
                              color: "#fff",
                              borderRadius: "5px 0px 0px 5px",
                            }}
                            onClick={() => handleReduceScoreMultiPlayer(index)}
                          >
                            -
                          </button>
                          <input
                            disabled
                            value={item.score}
                            style={{ width: "25px", textAlign:'center' }}
                          />
                          <button
                            style={{
                              backgroundColor: "#000",
                              color: "#fff",
                              borderRadius: "0px 5px 5px 0px",
                            }}
                            onClick={() => handleAddScoreMultiPlayer(index)}
                          >
                            +
                          </button>
                        </span>
                      </p>
                    ))
                  ) : eventDetail.eventType === "Team" && eventDetail.sportName === "Cricket" ? (
                    <>
                      <p >Extras: {teamAExtras}</p>
                      {teamA.map((eventDetail, index) => (
                        <p key={index}>
                          {eventDetail.name}
                          <span style={{ float: "right" }}>
                            <button
                              style={{
                                backgroundColor: "#000",
                                color: "#fff",
                                borderRadius: "5px 0px 0px 5px",
                              }}
                              onClick={() => handleReduceScore(index)}
                            >
                              -
                            </button>
                            <input
                              disabled
                              value={eventDetail.score}
                              style={{ width: "25px", textAlign:'center' }}
                            />
                            <button
                              style={{
                                backgroundColor: "#000",
                                color: "#fff",
                                borderRadius: "0px 5px 5px 0px",
                              }}
                              onClick={() => handleAddScore(index)}
                            >
                              +
                            </button>
                          </span>
                        </p>
                      ))}
                      <p > Extras: {teamBExtras} </p>
                      {teamB.map((eventDetail, index) => (
                        <p key={index}>
                          {eventDetail.name}
                          <span style={{ float: "right" }}>
                            <button
                              style={{
                                backgroundColor: "#000",
                                color: "#fff",
                                borderRadius: "5px 0px 0px 5px",
                              }}
                              onClick={() => handleReduceScoreTeamB(index)}
                            >
                              -
                            </button>
                            <input
                              disabled
                              value={eventDetail.score}
                              style={{ width: "25px", textAlign:'center' }}
                            />
                            <button
                              style={{
                                backgroundColor: "#000",
                                color: "#fff",
                                borderRadius: "0px 5px 5px 0px",
                              }}
                              onClick={() => handleAddScoreTeamB(index)}
                            >
                              +
                            </button>
                          </span>
                        </p>
                      ))}
                    </>
                  ) :
                    eventDetail.eventType === "Team" ? (
                      <>
                        <p>Team A</p>
                        {teamA.map((eventDetail, index) => (
                          <p key={index}>
                            {eventDetail.name}
                            <span style={{ float: "right" }}>
                              <button
                                style={{
                                  backgroundColor: "#000",
                                  color: "#fff",
                                  borderRadius: "5px 0px 0px 5px",
                                }}
                                onClick={() => handleReduceScore(index)}
                              >
                                -
                              </button>
                              <input
                                disabled
                                value={eventDetail.score}
                                style={{ width: "25px", textAlign:'center' }}
                              />
                              <button
                                style={{
                                  backgroundColor: "#000",
                                  color: "#fff",
                                  borderRadius: "0px 5px 5px 0px",
                                }}
                                onClick={() => handleAddScore(index)}
                              >
                                +
                              </button>
                            </span>
                          </p>
                        ))}
                        <p>Team B</p>
                        {teamB.map((eventDetail, index) => (
                          <p key={index}>
                            {eventDetail.name}
                            <span style={{ float: "right" }}>
                              <button
                                style={{
                                  backgroundColor: "#000",
                                  color: "#fff",
                                  borderRadius: "5px 0px 0px 5px",
                                }}
                                onClick={() => handleReduceScoreTeamB(index)}
                              >
                                -
                              </button>
                              <input
                                disabled
                                value={eventDetail.score}
                                style={{ width: "25px", textAlign:'center' }}
                              />
                              <button
                                style={{
                                  backgroundColor: "#000",
                                  color: "#fff",
                                  borderRadius: "0px 5px 5px 0px",
                                }}
                                onClick={() => handleAddScoreTeamB(index)}
                              >
                                +
                              </button>
                            </span>
                          </p>
                        ))}
                      </>
                    ) : eventDetail.eventType === "Player" ? (
                      <>
                        <p>
                          {playerA.name}
                          <span style={{ float: "right" }}>
                            <button
                              style={{
                                backgroundColor: "#000",
                                color: "#fff",
                                borderRadius: "5px 0px 0px 5px",
                              }}
                              onClick={handleReduceScorePlayerA}
                            >
                              -
                            </button>
                            <input
                              disabled
                              value={playerA.score}
                              style={{ width: "25px",textAlign:'center' }}
                            />
                            <button
                              style={{
                                backgroundColor: "#000",
                                color: "#fff",
                                borderRadius: "0px 5px 5px 0px",
                              }}
                              onClick={handleAddScorePlayerA}
                            >
                              +
                            </button>
                          </span>
                        </p>
                        <p>
                          {playerB.name}
                          <span style={{ float: "right" }}>
                            <button
                              style={{
                                backgroundColor: "#000",
                                color: "#fff",
                                borderRadius: "5px 0px 0px 5px",
                              }}
                              onClick={handleReduceScorePlayerB}
                            >
                              -
                            </button>
                            <input
                              disabled
                              value={playerB.score}
                              style={{ width: "25px",textAlign:'center' }}
                            />
                            <button
                              style={{
                                backgroundColor: "#000",
                                color: "#fff",
                                borderRadius: "0px 5px 5px 0px",
                              }}
                              onClick={handleAddScorePlayerB}
                            >
                              +
                            </button>
                          </span>
                        </p>
                      </>
                    ) : (
                      ""
                    )}
                  {eventDetail.sportName === "Cricket" ? (
                    <div className="container-fluid" style={{ paddingLeft: '0px' }}>
                      <div className="row">
                        <div className="col-6">
                          <button className="btn btn-dark w-100 mb-3" onClick={handleAddExtras}>
                            Add No Ball
                          </button>
                        </div>
                        <div className="col-6">
                          <button className="btn btn-dark w-100 mb-3" onClick={handleAddExtras}>
                            Add wide ball
                          </button>
                        </div>
                        <div className="col-6">
                          <button type="button" class="btn btn-danger w-100" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Mark as out
                          </button>

                          <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h5 class="modal-title" id="exampleModalLabel"></h5>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                  <select className="form-control" onChange={(e) => setPlayerMarkedForOut(e.target.value)}>
                                    <option>Select Player</option>
                                    {teamA.map((item, index) => (
                                      <option key={index} value={JSON.stringify({ teamID: eventDetail.teamName[0]._id, playerID: item._id })}>{item.name}</option>
                                    ))}
                                    {teamB.map((item, index) => (
                                      <option key={index} value={JSON.stringify({ teamID: eventDetail.teamName[1]._id, playerID: item._id })}>{item.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <div class="modal-footer">
                                  <button type="button" class="btn btn-primary" onClick={handleOut} data-bs-dismiss="modal">Out Player</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-6">
                          <button onClick={handleWinner} className="btn btn-dark w-100 mb-3" data-bs-toggle="modal" data-bs-target="#closeEventModal">
                            End Event
                          </button>
                        </div>
                        {/* <div className="col-6">
                          <button className="btn btn-dark w-100 mb-3" onClick={handleAddExtras}>
                            Add 4 runs
                          </button>
                        </div>
                        <div className="col-6">
                          <button className="btn btn-dark w-100 mb-3" onClick={handleAddExtras}>
                            Add 6 runs
                          </button>
                        </div> */}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="modal fade" id="closeEventModal" tabindex="-1" aria-labelledby="closeEventModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <p>Select Winner</p>
                        {eventDetail.eventType === "Multiplayer"
                          ?
                          <select className="form-control" onChange={(e) => setWinner(e.target.value)}>
                            {players.map((item, index) => (
                              <option key={index} value={JSON.stringify(item)}>{item.name}</option>
                            ))}
                          </select>
                          :
                          eventDetail.eventType === "Player"
                            ?
                            <select className="form-control" onChange={(e) => setWinner(e.target.value)}>
                              <option value={JSON.stringify(playerA)}>{playerA.name}</option>
                              <option value={JSON.stringify(playerB)}>{playerB.name}</option>
                            </select>
                            :
                            eventDetail.eventType === "Team"
                              ?
                              <select className="form-control" onChange={(e) => setWinner(e.target.value)}>
                                <option selected>Select Winner</option>
                                <option value={JSON.stringify(eventDetail.teamName[0])} >{eventDetail.teamName[0].teamName}</option>
                                <option value={JSON.stringify(eventDetail.teamName[1])}>{eventDetail.teamName[1].teamName}</option>
                              </select>
                              :
                              ""
                        }
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-dark" data-bs-dismiss="modal" onClick={handleCloseEvent}>Close Event</button>
                      </div>
                    </div>
                  </div>
                </div>
                {eventDetail && eventDetail.sportName !== "Cricket"
                  ?
                  <div className="d-flex justify-content-center">
                    <button onClick={handleWinner} className="btn btn-dark w-75 mb-3" data-bs-toggle="modal" data-bs-target="#closeEventModal">
                      End Event
                    </button>
                  </div>
                  :
                  ""}
              </div>
            </>
          ) : (
            ""
          )}
        </>
      )}
      <Footer />
    </>
  );
};

export default EventDetail;
