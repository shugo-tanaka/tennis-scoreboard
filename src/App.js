//TO DO: there is currently a lag between points displayed and supabase update. Had similar issue with increasing games.

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

  const [firstServeClicked, setFirstServeClicked] = useState(false);
  const [firstServeColor, setFirstServeColor] = useState("white");
  const [secondServeClicked, setSecondServeClicked] = useState(false);
  const [secondServeColor, setSecondServeColor] = useState("white");
  const [letClicked, setLetClicked] = useState(false);
  const [letColor, setLetColor] = useState("white");

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

  const postData = {
    points: [points1, points2],
    games: [games1, games2],
    sets: [currSets1, currSets2],
    prev_sets: [prevSets1, prevSets2],
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
  }, [points1, points2]);

  const incPoints1 = async () => {
    // tie break scenario
    if (games1 === 6 && games2 === 6) {
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
    setFirstServeClicked(false);
    setFirstServeColor(firstServeClicked ? "white" : "grey");
    setSecondServeClicked(false);
    setLetClicked(false);
    setSecondServeColor("white");
    setLetColor("white");
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
    if (games1 === 6 && games2 === 6) {
      setPoints2((prevPoints2) => {
        const newPoints2 = prevPoints2 + 1;
        if (newPoints2 >= 7 && newPoints2 > points1 + 1) {
          incGames1();
          setPoints1(0);
          setPoints2(0);
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
    setFirstServeClicked(false);
    setFirstServeColor(firstServeClicked ? "white" : "grey");
    setSecondServeClicked(false);
    setLetClicked(false);
    setSecondServeColor("white");
    setLetColor("white");
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

  return (
    <div>
      <h1 className="tennis-score">Tennis Score</h1>
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
          <div
            className="add-points"
            onClick={async () => {
              incPoints1();
            }}
          >
            +
          </div>
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
          <div
            className="add-points"
            onClick={() => {
              incPoints2();
            }}
          >
            +
          </div>
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
        <div className="shot-type">
          <div
            className="first-serve"
            onClick={() => {
              setFirstServeClicked(!firstServeClicked);
              setFirstServeColor(firstServeClicked ? "white" : "grey");
              setSecondServeClicked(false);
              setLetClicked(false);

              setSecondServeColor("white");
              setLetColor("white");
            }}
            style={{
              backgroundColor: firstServeColor,
            }}
          >
            First Serve
          </div>
          <div
            className="second-serve"
            onClick={() => {
              setSecondServeClicked(!secondServeClicked);
              setSecondServeColor(secondServeClicked ? "white" : "grey");
              setFirstServeClicked(false);
              setLetClicked(false);

              setFirstServeColor("white");
              setLetColor("white");
            }}
            style={{
              backgroundColor: secondServeColor,
            }}
          >
            Second Serve
          </div>
          <div
            className="let"
            onClick={() => {
              setLetClicked(!letClicked);
              setLetColor(letClicked ? "white" : "grey");
              setSecondServeClicked(false);
              setFirstServeClicked(false);

              setSecondServeColor("white");
              setFirstServeColor("white");
            }}
            style={{
              backgroundColor: letColor,
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
