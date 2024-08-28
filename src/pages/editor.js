// TO DO:
// need to be able to display that the game is finished. Created but add to the observer side as opposed to the score keeping side.
// what if there are multiple matches in a day - how do you distinguish games if not opponent name?
// need to be able to show what side Koji is on, etc. Maybe create a button that switches sides? Probably don't need one TBH.
// Need to also show which side he is serving to.
// need to convert it to mobile.
// need a refresh button for editor side to pull last available data!!!
// maybe add notes capabilities. maybe do a popup after you click one of the point options, which allows for common notes.

import { useState, useEffect } from "react";
import "./editor.css";

const Editor = () => {
  // initializing variables
  const [prevSets1, setPrevSets1] = useState([]);
  const [player1, setPlayer1] = useState("Koji Tanaka");
  const [currSets1, setCurrSets1] = useState(0);
  const [games1, setGames1] = useState(0);
  const [points1, setPoints1] = useState(0);
  const [sets1, setSets1] = useState([...prevSets1, games1]);

  const [prevSets2, setPrevSets2] = useState([]);
  const [player2, setPlayer2] = useState("Player 2");
  const [currSets2, setCurrSets2] = useState(0);
  const [games2, setGames2] = useState(0);
  const [points2, setPoints2] = useState(0);
  const [sets2, setSets2] = useState([...prevSets2, games2]);

  const [serveCircles, setServeCircles] = useState([]);
  const [serveData, setServeData] = useState([]);

  // variables for the serve buttons
  const [firstServeClicked, setFirstServeClicked] = useState(true);
  // const [firstServeColor, setFirstServeColor] = useState("white");
  const [firstServeScale, setFirstServeScale] = useState("90%");
  const [secondServeClicked, setSecondServeClicked] = useState(false);
  // const [secondServeColor, setSecondServeColor] = useState("grey");
  const [secondServeScale, setSecondServeScale] = useState("100%");
  const [letClicked, setLetClicked] = useState(false);
  // const [letColor, setLetColor] = useState("grey");
  const [letScale, setLetScale] = useState("100%");
  const [isPointInc, setIsPointInc] = useState(1);

  //variables for data input pop-up
  const [isModalOpen, setIsModalOpen] = useState(true); //popup now starts off open
  const [inputValue, setInputValue] = useState("");
  const [submitClicked, setSubmitClicked] = useState(-1);
  const [winner, setWinner] = useState("");
  // const [errorDate, setErrorDate] = useState(false);
  // const [errorP1, setErrorP1] = useState(false);
  // const [errorP2, setErrorP2] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  //back end serveCircles
  const [serveX, setServeX] = useState([]);
  const [serveY, setServeY] = useState([]);
  const [serveBallText, setServeBallText] = useState([]);

  // accessing data from API
  useEffect(() => {
    // Make an API request to FastAPI endpoint
    fetch(`${process.env.REACT_APP_BACKEND_URL}/player_names/`)
      .then((response) => response.json())
      .then((output) => {
        setPlayer1(output[0]);
        setPlayer2(output[1]);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  // console.log(process.env.REACT_APP_BACKEND_URL);

  const undoPoint = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/undo_score/`)
      .then((response) => response.json())
      .then((output) => {
        console.log(output.data[output.data.length - 1]);
        const outputData = output.data[output.data.length - 1];
        setPoints1(outputData["points_1"]);
        setPoints2(outputData["points_2"]);
        setGames1(outputData["games_1"]);
        setGames2(outputData["games_2"]);
        setCurrSets1(outputData["curr_sets_1"]);
        setCurrSets2(outputData["curr_sets_2"]);
        setPrevSets1(outputData["prev_sets_1"]);
        setPrevSets2(outputData["prev_sets_2"]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getCurrentDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // serve order for setting match info
  const [selectedOrder, setSelectedOrder] = useState("p1");

  const handleServeOrderChange = (event) => {
    setSelectedOrder(event.target.value);
  };

  const [inputValues, setInputValues] = useState({
    date: getCurrentDate(),
    // startTime: "",
    player1Name: "Koji Tanaka",
    player2Name: "Player 2",
    serveOrder: selectedOrder,
  });

  //serve radio button
  const [selectedServerValue, setSelectedServerValue] = useState(selectedOrder);

  const handleServerChange = (event) => {
    setSelectedServerValue(event.target.value);
  };

  const postData = {
    points: [points1, points2],
    games: [games1, games2],
    sets: [currSets1, currSets2],
    prev_sets: [prevSets1, prevSets2],
    player_name: [inputValues.player1Name, inputValues.player2Name],
    date: inputValues.date,
    selectedServer: selectedServerValue,
  };

  useEffect(() => {
    //work on this!!!
    const serveLoc = () => {
      const backendServeData = {
        sX: serveX,
        sY: serveY,
        sBallText: serveBallText,
      };

      fetch(`${process.env.REACT_APP_BACKEND_URL}/serve_locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendServeData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from the backend if needed
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    serveLoc();
  }, [serveCircles]);

  useEffect(() => {
    const updateSupa = () => {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/scoreboard_input`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from the backend if needed
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    try {
      setIsUpdating(true);
      updateSupa();
    } finally {
      setIsUpdating(false);
    }
  }, [postData]);

  //UseEffects to change server radio button automatically.
  useEffect(() => {
    if ((currSets1 + currSets2) % 2 == 0) {
      setSelectedServerValue(selectedOrder);
    } else {
      if (selectedOrder == "p1") {
        setSelectedServerValue("p2");
      } else {
        setSelectedServerValue("p1");
      }
    }
  }, [currSets1, currSets2]);

  const incPoints1 = async () => {
    if (isUpdating) {
      return;
    }
    setIsUpdating(true);
    // stop being able to be pushed once match is won

    // tie break replacement for set 3
    if (currSets1 === 1 && currSets2 === 1) {
      setPoints1((prevPoints1) => {
        const newPoints1 = prevPoints1 + 1;
        if (newPoints1 + points2 == 1) {
          setSelectedServerValue(selectedServerValue === "p1" ? "p2" : "p1");
        } else if ((newPoints1 + points2) % 2 == 1) {
          setSelectedServerValue(selectedServerValue === "p1" ? "p2" : "p1");
        }
        if (newPoints1 >= 10 && newPoints1 > points2 + 1) {
          incSets1();
          setPoints2(0);
          setPoints1(0);
          setGames1(0);
          setGames2(0);
          addPrevSets1(newPoints1);
          addPrevSets2(points2);
        }
        return newPoints1;
      });
    }

    // tie break scenario for first two sets
    else if (games1 === 6 && games2 === 6) {
      setPoints1((prevPoints1) => {
        const newPoints1 = prevPoints1 + 1;
        //insert tie break server change logic here.
        if (newPoints1 + points2 == 1) {
          setSelectedServerValue(selectedServerValue === "p1" ? "p2" : "p1");
        } else if ((newPoints1 + points2) % 2 == 1) {
          setSelectedServerValue(selectedServerValue === "p1" ? "p2" : "p1");
        }
        if (newPoints1 >= 7 && newPoints1 > points2 + 1) {
          incGames1();
          setPoints1(0);
          setPoints2(0);
        }
        return newPoints1;
      });
    } else if (points1 === 0) {
      setPoints1(15);
    } else if (points1 === 15) {
      setPoints1(30);
    } else if (points1 === 30) {
      if (points2 === 40) {
        setPoints1("Deuce");
        setPoints2("Deuce");
      } else {
        setPoints1(40);
      }
    } else if (points1 === "Deuce") {
      setPoints1("ad");
      setPoints2("-");
    } else if (points2 === "ad") {
      setPoints1("Deuce");
      setPoints2("Deuce");
    } else {
      incGames1();
      setPoints1(0);
      setPoints2(0);
      // setSelectedServerValue(selectedServerValue === "p1" ? "p2" : "p1");
    }
    setServeX([]);
    setServeY([]);
    setServeBallText([]);
    setServeCircles([]);
    setFirstServeClicked(true);
    setFirstServeScale(firstServeClicked ? "90%" : "100%");
    setSecondServeClicked(false);
    setLetClicked(false);
    setSecondServeScale("100%");
    setLetScale("100%");
    setIsPointInc(isPointInc * -1);
  };

  const incGames1 = () => {
    setGames1((prevGames1) => {
      // preGames1 is the previous games1?
      var newGames1 = prevGames1 + 1;

      if (newGames1 === 6 && games2 <= 4) {
        incSets1();
        addPrevSets1(newGames1);
        addPrevSets2(games2);
        newGames1 = 0;
        setGames2(0);
      } else if (newGames1 === 7 && games2 === 6) {
        incSets1();
        addPrevSets1(newGames1);
        addPrevSets2(games2);
        newGames1 = 0;
        setGames2(0);
      } else if (newGames1 >= 6 && games2 >= 5) {
        if (newGames1 > games2 + 1) {
          incSets1();
          addPrevSets1(newGames1);
          addPrevSets2(games2);
          newGames1 = 0;
          setGames2(0);
        }
      } else {
        setSelectedServerValue(selectedServerValue === "p1" ? "p2" : "p1");
      }

      return newGames1;
    });
  };

  const incSets1 = () => {
    setCurrSets1((set) => set + 1);
  };

  const addPrevSets1 = (score) => {
    let newSet = [...prevSets1];
    newSet.push(score);
    setPrevSets1(newSet);
  };

  const incPoints2 = () => {
    if (isUpdating) {
      return;
    }

    // stop being able to be pushed once match is won
    // else if (currSets1 === 2 || currSets2 === 2) {
    //   if (currSets1 > currSets2) {
    //     setWinner(player1);
    //   } else {
    //     setWinner(player2);
    //   }

    //   setIsEndResultOpen(true);

    //   return null;
    // } else
    if (currSets1 === 2 || currSets2 === 2) {
      return null;
      //tie break going into 3rd set scenario
    } else if (currSets2 === 1 && currSets1 === 1) {
      setPoints2((prevPoints2) => {
        const newPoints2 = prevPoints2 + 1;
        if (newPoints2 + points1 == 1) {
          setSelectedServerValue(selectedServerValue === "p1" ? "p2" : "p1");
        } else if ((newPoints2 + points1) % 2 == 1) {
          setSelectedServerValue(selectedServerValue === "p1" ? "p2" : "p1");
        }
        if (newPoints2 >= 10 && newPoints2 > points1 + 1) {
          incSets2();
          setPoints2(0);
          setPoints1(0);
          setGames1(0);
          setGames2(0);
        }
        return newPoints2;
      });
      //tie break going into 6to6 games scenario
    } else if (games1 === 6 && games2 === 6) {
      setPoints2((prevPoints2) => {
        const newPoints2 = prevPoints2 + 1;
        if (newPoints2 + points1 == 1) {
          setSelectedServerValue(selectedServerValue === "p1" ? "p2" : "p1");
        } else if ((newPoints2 + points1) % 2 == 1) {
          setSelectedServerValue(selectedServerValue === "p1" ? "p2" : "p1");
        }
        if (newPoints2 >= 7 && newPoints2 > points1 + 1) {
          incGames2();
          setPoints1(0);
          setPoints2(0);
          addPrevSets1(points1);
          addPrevSets2(newPoints2);
        }
        return newPoints2;
      });
      //regular scenario
    } else if (points2 === 0) {
      setPoints2(15);
    } else if (points2 === 15) {
      setPoints2(30);
    } else if (points2 === 30) {
      if (points1 === 40) {
        setPoints1("Deuce");
        setPoints2("Deuce");
      } else {
        setPoints2(40);
      }
    } else if (points2 === "Deuce") {
      setPoints2("ad");
      setPoints1("-");
    } else if (points1 === "ad") {
      setPoints1("Deuce");
      setPoints2("Deuce");
    } else {
      incGames2();
      setPoints2(0);
      setPoints1(0);
    }
    setServeX([]);
    setServeY([]);
    setServeBallText([]);
    setServeCircles([]);
    setFirstServeClicked(true);
    setFirstServeScale(firstServeClicked ? "90%" : "100%");
    setSecondServeClicked(false);
    setLetClicked(false);
    setSecondServeScale("100%");
    setLetScale("100%");
    setIsPointInc(isPointInc * -1);
  };

  const incGames2 = () => {
    setGames2((prevGames2) => {
      var newGames2 = prevGames2 + 1;
      //scenario when p2 has reached 6 and p1 has less than 5
      if (newGames2 === 6 && games1 <= 4) {
        incSets2();
        addPrevSets1(games1);
        addPrevSets2(newGames2);
        setGames1(0);
        newGames2 = 0;
        //scenario where p2 wins the tie break
      } else if (newGames2 === 7 && games1 === 6) {
        incSets2();
        addPrevSets1(games1);
        addPrevSets2(newGames2);
        setGames1(0);
        newGames2 = 0;
        //scenario where p2 wins 7-5
      } else if (newGames2 >= 6 && games1 >= 5) {
        if (newGames2 > games1 + 1) {
          incSets2();
          addPrevSets1(games1);
          addPrevSets2(newGames2);
          setGames1(0);
          newGames2 = 0;
        }
      } else {
        setSelectedServerValue(selectedServerValue === "p1" ? "p2" : "p1");
      }

      return newGames2;
    });
  };

  const incSets2 = () => {
    setCurrSets2((set) => set + 1);
  };

  const addPrevSets2 = (score) => {
    let newSet = [...prevSets2];
    newSet.push(score);
    setPrevSets2(newSet);
  };

  const handleImageClick = (event) => {
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();

    // Calculate the adjusted coordinates
    const x = event.clientX - rect.left - 5;
    const y = event.clientY - rect.top - 5;

    const ballText = firstServeClicked
      ? "I"
      : secondServeClicked
      ? "II"
      : letClicked
      ? "L"
      : "";

    // console.log("Ball Color:", ballColor);

    const newServeCircle = { x, y, ballText };

    setServeX([...serveX, x]);
    setServeY([...serveY, y]);
    setServeBallText([...serveBallText, ballText]);

    setServeCircles([...serveCircles, newServeCircle]);

    setServeData([...serveData, newServeCircle]);
    // TODO: above includes non-serves
  };

  const undo = () => {
    const tempServeCircles = [...serveCircles];
    tempServeCircles.pop();

    const tempServeData = [...serveData];
    tempServeData.pop();
    setServeCircles(tempServeCircles);
    setServeData(tempServeData);
  };

  //pop-up related functions

  useEffect(() => {
    const updateSupaMatch = () => {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/match_data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputValues),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    updateSupaMatch();
  }, [submitClicked]);

  const clickSubmit = () => {
    setPlayer1(inputValues.player1Name);
    setPlayer2(inputValues.player2Name);
    setSelectedServerValue(selectedOrder === "p1" ? "p1" : "p2");
    setSubmitClicked(submitClicked * -1);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Input value:", inputValue);
    setIsModalOpen(false);
  };

  //end result pop up related

  const [isEndResultOpen, setIsEndResultOpen] = useState(false);

  const handleCloseEndResult = () => {
    setIsEndResultOpen(false);
  };

  //display winner
  useEffect(() => {
    if (currSets1 === 2 || currSets2 === 2) {
      if (currSets1 > currSets2) {
        setWinner(player1);
      } else {
        setWinner(player2);
      }

      setIsEndResultOpen(true);

      return null;
    }
  }, [currSets1, currSets2]);

  //remove new games when winner is decided
  useEffect(() => {
    setSets1(sets1.slice(0, -1));
    setSets2(sets2.slice(0, -1));
  }, [isEndResultOpen]);

  // combine prev sets and games
  useEffect(() => {
    setSets1([...prevSets1, games1]);
    setSets2([...prevSets2, games2]);
  }, [games1, games2]);

  //HTML rendering
  return (
    <div className="base-div">
      <h1 className="tennis-score">
        {inputValues.date} {player1} vs {player2}
      </h1>
      <div className="end-result">
        {" "}
        {isEndResultOpen && (
          <div className="end-result-overlay">
            <div className="end-result-modal">
              <div className="end-result-content">
                <div className="winner">Winner: {winner}</div>
                <div className="winner-sets">
                  {currSets1} : {currSets2}{" "}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="popup">
        <div className="set-match-info-div">
          <button className="set-match-info" onClick={handleOpenModal}>
            Set Match Info
          </button>
        </div>
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="popup-top">
                <div className="popup-name">Match Information</div>
                <span className="close" onClick={handleCloseModal}>
                  &times;
                </span>
              </div>
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <label className="match-info-date">
                    Date MM/DD/YYYY
                    <input
                      type="Date"
                      name="date"
                      value={inputValues.date}
                      onChange={handleInputChange}
                    />
                  </label>
                  {/*<label>
                    {" "}
                    {/*maybe put something other than start time to categorize it
                    Start Time
                    <input
                      type="Text"
                      name="startTime"
                      value={inputValues.startTime}
                      onChange={handleInputChange}
                    />
                  </label> */}
                  <label className="match-info-p1">
                    Player 1 Name
                    {/* {errorP1 && (
                      <div className="error-p1">
                        {" "}
                        Please enter name for Player 1.{" "}
                      </div>
                    )} */}
                    <input
                      type="text"
                      name="player1Name"
                      value={inputValues.player1Name}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label className="match-info-p2">
                    Player 2 Name
                    {/* {errorP2 && (
                      <div className="error-p1">
                        {" "}
                        Please enter name for Player 2.{" "}
                      </div>
                    )} */}
                    <input
                      type="text"
                      name="player2Name"
                      value={inputValues.player2Name}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label className="serve-order">
                    Koji Serve Order
                    <div className="serve-order-sub">
                      <div className="serve-first">1st</div>
                      <input
                        type="radio"
                        name="serve-first-radio"
                        className="serve-first-radio"
                        value="p1"
                        checked={selectedOrder === "p1"}
                        onChange={handleServeOrderChange}
                      ></input>
                    </div>
                    <div className="serve-order-sub">
                      <div className="serve-second">2nd</div>
                      <input
                        type="radio"
                        name="serve-second-radio"
                        className="serve-second-radio"
                        value="p2"
                        checked={selectedOrder === "p2"}
                        onChange={handleServeOrderChange}
                      ></input>
                    </div>
                  </label>
                  <button
                    className="submit-button"
                    type="submit"
                    onClick={clickSubmit}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="data-table">
        <div className="labels">
          <div className="name">Player Name</div>
          <div className="serve-status">Serve</div>
          <div className="previous-sets">Sets</div>
          {/* <div className="sets">Sets</div>
          <div className="games">Games</div> */}
          <div className="points">Points</div>
        </div>
        <div className="player1">
          {/*player1 1*/}

          <div className="player-name">{player1}</div>
          <div className="player-serve-status">
            <label>
              <input
                type="radio"
                value="p1"
                checked={selectedServerValue === "p1"}
                onChange={handleServerChange}
              ></input>
            </label>
          </div>
          <div className="player-previous-sets">
            {sets1.map((set) => {
              return <div>{set}</div>;
            })}
          </div>
          {/* <div className="player-sets">{currSets1}</div>
          <div className="player-games">{games1}</div> */}
          <div className="player-points">{points1}</div>
          {/* <div
            className="add-points"
            onClick={async () => {
              incPoints1();
            }}
          >
            +
          </div> */}
        </div>
        <div className="player2">
          {/*player two*/}

          <div className="player-name">{player2}</div>
          <div className="player-serve-status">
            <label>
              <input
                type="radio"
                value="p2"
                checked={selectedServerValue === "p2"}
                onChange={handleServerChange}
              ></input>
            </label>
          </div>
          <div className="player-previous-sets">
            {sets2.map((set) => {
              return <div>{set}</div>;
            })}
          </div>
          {/* <div className="player-sets">{currSets2}</div>
          <div className="player-games">{games2}</div> */}
          <div className="player-points">{points2}</div>
          {/* <div
            className="add-points"
            onClick={() => {
              incPoints2();
            }}
          >
            +
          </div> */}
        </div>
      </div>
      <div className="section2">
        <div className="tennis-court-image" onClick={handleImageClick}>
          <img
            src="/tennis-court-diagram.jpg"
            alt="Tennis Court"
            style={{ width: "100%", height: "100%" }}
          />
          {serveCircles.map((circle, index) => (
            <div
              key={index}
              className="serve-circles"
              style={{
                left: circle.x,
                top: circle.y,
                fontSize: "8.5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              {circle.ballText}
            </div>
          ))}
        </div>
        <div className="buttons">
          <div className="point-options-label-editor">POINT OPTIONS</div>
          <div className="point-options-editor">
            <button
              className="point-p1"
              onClick={async () => {
                incPoints1();
              }}
              // disabled={isUpdating}
            >
              + {player1.split(" ")[0][0]} {player1.split(" ")[1]}
            </button>
            <button
              className="point-p2"
              onClick={async () => {
                incPoints2();
              }}
            >
              + {player2.split(" ")[0][0]} {player2.split(" ")[1]}
            </button>
            <button
              className="undo-point"
              onClick={async () => {
                undoPoint();
              }}
            >
              Undo Point
            </button>
          </div>
          <div className="serve-options-label-editor">SERVE OPTIONS</div>
          <div className="serve-options-editor">
            {/* <div className="serving">
              <div>SERVING</div>
              {serveOptions.map((option) => (
                <lable key={option.id}>
                  <input
                    type="radio"
                    value={option.id}
                    checked={selectedServeValue === option.id}
                    onChnage={handleServeChange}
                  />
                </lable>
              ))}
            </div> */}
            <button
              className={`first-serve ${firstServeClicked ? "clicked" : ""}`}
              onClick={() => {
                setFirstServeClicked(true);
                setFirstServeScale("90%"); //firstServeClicked ? "90%" : "100%");
                setSecondServeClicked(false);
                setLetClicked(false);

                setSecondServeScale("100%");
                setLetScale("100%");
              }}
              style={{
                scale: firstServeScale,
              }}
            >
              1st Serve
            </button>
            <button
              className={`second-serve ${secondServeClicked ? "clicked" : ""}`}
              onClick={() => {
                setSecondServeClicked(true);
                setSecondServeScale("90%"); //secondServeClicked ? "90%" : "100%");
                setFirstServeClicked(false);
                setLetClicked(false);

                setFirstServeScale("100%");
                setLetScale("100%");
              }}
              style={{
                scale: secondServeScale,
              }}
            >
              2nd Serve
            </button>
            <button
              className={`let ${letClicked ? "clicked" : ""}`}
              onClick={() => {
                setLetClicked(true); //!letClicked);
                setLetScale("90%"); //letClicked ? "90%" : "100%");
                setSecondServeClicked(false);
                setFirstServeClicked(false);

                setSecondServeScale("100%");
                setFirstServeScale("100%");
              }}
              style={{
                scale: letScale,
              }}
            >
              Let
            </button>
            <button className="undo" onClick={undo}>
              Undo Serve
            </button>
          </div>
          {/* maybe insert pic of undo instead */}
        </div>
        ;
      </div>
    </div>
  );
};

export default Editor;

/*
game
  who is seving
  first serve vs second serve 
  score
   match point/ break point
  tie breaker version
set
  set count
  tie breaker
match
  match count

winner/loser
*/
