//TO DO: need to be able to display that the game is finished
//undo function still needs work. The if statement is not catching. Maybe output is null.
//changing the match info changes the text for all subsections. need to create more variables, and handleInputChange functions for each. Maybe connect the input to some other variables like player1.
// need to be able to do error handling for inputing match information.
// what if there are multiple matches in a day - how do you distinguish games if not opponent name?
// make point Koji Tanaka button into point K. Tanaka.
// send inputValues to supabase. Pull player Name from supabase?

import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // initializing variables
  const [prevSets1, setPrevSets1] = useState([]);
  const [player1, setPlayer1] = useState([]);
  const [currSets1, setCurrSets1] = useState(0);
  const [games1, setGames1] = useState(0);
  const [points1, setPoints1] = useState(0);

  const [prevSets2, setPrevSets2] = useState([]);
  const [player2, setPlayer2] = useState([]);
  const [currSets2, setCurrSets2] = useState(0);
  const [games2, setGames2] = useState(0);
  const [points2, setPoints2] = useState(0);

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

  // accessing data from API
  useEffect(() => {
    // Make an API request to FastAPI endpoint
    fetch("http://127.0.0.1:8000/player_names/")
      .then((response) => response.json())
      .then((output) => {
        setPlayer1(output.data[0]["player_name"]);
        setPlayer2(output.data[1]["player_name"]);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const undoPoint = () => {
    fetch("http://127.0.0.1:8000/undo_score/")
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

  const [inputValues, setInputValues] = useState({
    date: new Date().toLocaleDateString(),
    startTime: "",
    player1Name: "Koji Tanaka",
    player2Name: "Player 2",
  });

  const postData = {
    points: [points1, points2],
    games: [games1, games2],
    sets: [currSets1, currSets2],
    prev_sets: [prevSets1, prevSets2],
    player_name: [inputValues.player1Name, inputValues.player2Name],
  };

  useEffect(() => {
    const updateSupa = () => {
      fetch("http://127.0.0.1:8000/scoreboard_input", {
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

    updateSupa();
  }, [isPointInc]);

  const incPoints1 = async () => {
    // stop being able to be pushed once match is won
    if (currSets1 === 2 || currSets2 === 2) {
      return null;
    }

    // tie break replacement for set 3
    else if (currSets1 === 1 && currSets2 === 1) {
      setPoints1((prevPoints1) => {
        const newPoints1 = prevPoints1 + 1;
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
    }
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
      const newGames1 = prevGames1 + 1;

      if (newGames1 === 6 && games2 <= 4) {
        incSets1();
        addPrevSets1(newGames1);
        addPrevSets2(games2);
        setGames1(0);
        setGames2(0);
      } else if (newGames1 === 7 && games2 === 6) {
        incSets1();
        addPrevSets1(newGames1);
        addPrevSets2(games2);
        setGames1(0);
        setGames2(0);
      } else if (newGames1 >= 6 && games2 >= 5) {
        if (newGames1 > games2 + 1) {
          incSets1();
          addPrevSets1(newGames1);
          addPrevSets2(games2);
          setGames1(0);
          setGames2(0);
        }
      }

      return newGames1;
    });
  };
  // need to figure out how to update games correctly when it reaches 6. currently will go past 6.

  const incSets1 = () => {
    setCurrSets1((set) => set + 1);
  };

  const addPrevSets1 = (score) => {
    let newSet = [...prevSets1];
    newSet.push(score);
    setPrevSets1(newSet);
  };

  const incPoints2 = () => {
    if (currSets1 === 2 || currSets2 === 2) {
      return null;
    } else if (currSets2 === 1 && currSets1 === 1) {
      setPoints2((prevPoints2) => {
        const newPoints2 = prevPoints2 + 1;
        if (newPoints2 >= 10 && newPoints2 > points1 + 1) {
          incSets2();
          setPoints2(0);
          setPoints1(0);
          setGames1(0);
          setGames2(0);
        }
        return newPoints2;
      });
    } else if (games1 === 6 && games2 === 6) {
      setPoints2((prevPoints2) => {
        const newPoints2 = prevPoints2 + 1;
        if (newPoints2 >= 7 && newPoints2 > points1 + 1) {
          incGames1();
          setPoints1(0);
          setPoints2(0);
          addPrevSets1(points1);
          addPrevSets2(newPoints2);
        }
        return newPoints2;
      });
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
      const newGames2 = prevGames2 + 1;

      if (newGames2 === 6 && games1 <= 4) {
        incSets2();
        addPrevSets1(games1);
        addPrevSets2(newGames2);
        setGames1(0);
        setGames2(0);
      } else if (newGames2 === 7 && games1 === 6) {
        incSets2();
        addPrevSets1(games1);
        addPrevSets2(newGames2);
        setGames1(0);
        setGames2(0);
      } else if (newGames2 >= 6 && games1 >= 5) {
        if (newGames2 > games1 + 1) {
          incSets2();
          addPrevSets1(games1);
          addPrevSets2(newGames2);
          setGames1(0);
          setGames2(0);
        }
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
      fetch("http://127.0.0.1:8000/match_data", {
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

  return (
    <div>
      <h1 className="tennis-score">Tennis Score</h1>
      <div className="popup">
        <button className="set-match-info" onClick={handleOpenModal}>
          Set Match Information
        </button>
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
                  <label>
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
                  <label>
                    Player 1 Name
                    <input
                      type="text"
                      name="player1Name"
                      value={inputValues.player1Name}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Player 2 Name
                    <input
                      type="text"
                      name="player2Name"
                      value={inputValues.player2Name}
                      onChange={handleInputChange}
                    />
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
          <div className="previous-sets">Previous Sets</div>
          <div className="name">Player Name</div>
          <div className="sets">Sets</div>
          <div className="games">Games</div>
          <div className="points">Points</div>
        </div>
        <div className="player1">
          {/*player1 1*/}
          <div className="player-previous-sets">
            {prevSets1.map((set) => {
              return <div>{set}</div>;
            })}
          </div>
          <div className="player-name">{player1}</div>
          <div className="player-sets">{currSets1}</div>
          <div className="player-games">{games1}</div>
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
          <div className="player-previous-sets">
            {prevSets2.map((set) => {
              return <div>{set}</div>;
            })}
          </div>
          <div className="player-name">{player2}</div>
          <div className="player-sets">{currSets2}</div>
          <div className="player-games">{games2}</div>
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
            style={{ width: "75%", height: "75%" }}
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
          <div
            className="point-p1"
            onClick={async () => {
              incPoints1();
            }}
          >
            Point {player1 /*.split(" ")[0]} {player1.split(" ")[1][0]*/}.
          </div>
          <div
            className="point-p2"
            onClick={async () => {
              incPoints2();
            }}
          >
            Point {player2 /*.split(" ")[0]*/}
          </div>
          <div
            className="undo-point"
            onClick={() => {
              undoPoint();
            }}
          >
            Undo Point
          </div>
          <div className="serve-types">SERVE TYPES</div>
          <div
            className="first-serve"
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
            First Serve
          </div>
          <div
            className="second-serve"
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
            Second Serve
          </div>
          <div
            className="let"
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
          </div>

          <div className="undo" onClick={undo}>
            Undo Serve
          </div>
          {/* maybe insert pic of undo instead */}
        </div>
      </div>
    </div>
  );
}

export default App;

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
