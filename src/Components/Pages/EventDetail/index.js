import { useEffect, useState } from "react";
import Footer from "../../Footer";
import Navbar from "../../Navbar";
import Pusher from "pusher-js";
import { createAndUpdateScore, getEventByID, getExtrasForTeam, updateEventByID } from "../../../API/Events";
import { useNavigate, useParams } from "react-router-dom";
import { getPlayerByID } from "../../../API/Player";

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
          // get players for team A
          res.data.message[0].teamName[0].player.map((item, index) => {
            getPlayerByID(item).then((res) => {
              res.data.message[0]["score"] = 0;
              setTeamA((oldArr) => [...oldArr, res.data.message[0]]);
            });
          });

          // get players for team B
          res.data.message[0].teamName[1].player.map((item, index) => {
            getPlayerByID(item).then((res) => {
              res.data.message[0]["score"] = 0;
              setTeamB((oldArr) => [...oldArr, res.data.message[0]]);
            });
          });
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

  const handleAddScore = (index) => {
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
    const updatedPlayers = [...teamB];
    let score = updatedPlayers[index].score++;
    setTeamB(updatedPlayers);

    const reqBody = {
      eventId: eventDetail._id,
      gameType: eventDetail.eventType,
      playerId: updatedPlayers[index]._id,
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

  const handleReduceScoreTeamB = (index) => {
    const updatedPlayers = [...teamB];
    if (updatedPlayers[index].score >= 1) {
      let score = updatedPlayers[index].score--;
      setTeamB(updatedPlayers);

      const reqBody = {
        eventId: eventDetail._id,
        gameType: eventDetail.eventType,
        playerId: updatedPlayers[index]._id,
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

  const handleAddScoreMultiPlayer = (index) => {
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
        }
      }

      createAndUpdateScore(reqBody).then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      })
    })
  }

  const navigate = useNavigate();

  const handleCloseEvent = () => {
    console.log(JSON.parse(winner));
    let reqBody = {
      _id: eventDetail._id,
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
                <div className="card-body">
                  <div className="container-fluid">
                    {eventDetail.eventType === "MultiPlayer" ? (
                      <div className="row">
                        <div className="col-5 d-flex">
                          <img
                            src={eventDetail?.teamName[0]?.logo}
                            alt="TeamAlogo"
                            width="40px"
                            heigth="40px"
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
                          <img src={eventDetail.playerName[0]?.image} alt="Playerlogo" width="40px" heigth="40px" />
                          <p style={{ marginLeft: '15px' }} className="pt-2 mb-0">{eventDetail.playerName[0]?.name}</p>
                        </div>
                        <div className="col-2 pt-2">VS</div>
                        <div className="col-5 d-flex float-right">
                          <p style={{ marginRight: '15px' }} className="pt-2 mb-0">{eventDetail.playerName[1]?.name}</p>
                          <img src={eventDetail.playerName[1]?.image} alt="Playerlogo " width="40px" heigth="40px" />
                        </div>
                      </div>
                    ) : (
                      <div className="row">
                        <div className="col-5 d-flex">
                          <img
                            src={eventDetail?.teamName[0]?.logo}
                            alt="TeamAlogo"
                            width="40px"
                            heigth="40px"
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
                            width="40px"
                            heigth="40px"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-center mt-2 p-0">
                    {eventDetail.date} || {eventDetail.time} ||{" "}
                    {eventDetail.venue}{" "}
                  </p>
                  <p className="mt-2">
                    Winner:{" "}
                    <span style={{ marginLeft: "35px" }}>
                      {eventDetail.winner.length === 0
                        ? "TBA"
                        : eventDetail.winner}
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
                <div className="card-body">
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
                            style={{ width: "25px" }}
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
                      <p>Team A <span style={{ float: 'right' }}>Extras: {teamAExtras}</span></p>
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
                              style={{ width: "25px" }}
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
                      <p>Team B <span style={{ float: 'right' }}>Extras: {teamBExtras}</span></p>
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
                              style={{ width: "25px" }}
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
                                style={{ width: "25px" }}
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
                                style={{ width: "25px" }}
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
                              style={{ width: "25px" }}
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
                              style={{ width: "25px" }}
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
                    <div className="container-fluid">
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
                          <button className="btn btn-danger w-100 mb-3">
                            Mark as out
                          </button>
                        </div>

                        <div className="col-6">
                          <button onClick={handleWinner} className="btn btn-dark w-100 mb-3" data-bs-toggle="modal" data-bs-target="#closeEventModal">
                            End Event
                          </button>
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
                                  <select className="form-control" onChange={(e) => setWinner(JSON.stringify(e.target.value))}>
                                    {players.map((item, index) => (
                                      <option key={index} value={JSON.stringify(item)}>{item.name}</option>
                                    ))}
                                  </select>
                                  :
                                  eventDetail.eventType === "Player"
                                    ?
                                    <select className="form-control" onChange={(e) => setWinner(JSON.stringify(e.target.value))}>
                                      <option value={JSON.stringify(playerA)}>{playerA.name}</option>
                                      <option value={JSON.stringify(playerB)}>{playerB.name}</option>
                                    </select>
                                    :
                                    eventDetail.eventType === "Team"
                                      ?
                                      <select className="form-control" onChange={(e) => setWinner(e.target.value)}>
                                        <option value={JSON.stringify(eventDetail.teamName[0])} selected>{eventDetail.teamName[0].teamName}</option>
                                        <option value={JSON.stringify(eventDetail.teamName[1])}>{eventDetail.teamName[1].teamName}</option>
                                      </select>
                                      :
                                      ""
                                }
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-dark" onClick={handleCloseEvent}>Close Event</button>
                              </div>
                            </div>
                          </div>
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
