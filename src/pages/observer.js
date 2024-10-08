// need to be able to pull data from supa base to populate the score board.
// when refreshed, the name pulls player 2 before it pulls what ever it has been updated to.
// serve data still needs to get pulled.
//need to be able to show who has serve.

// vercel for deployment

import { useState, useEffect } from "react";
import "./observer.css";

const Observer = () => {
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
  // const [serveData, setServeData] = useState([]);

  // variables for the serve buttons
  // const [firstServeClicked, setFirstServeClicked] = useState(true);
  // const [firstServeColor, setFirstServeColor] = useState("white");
  // const [firstServeScale, setFirstServeScale] = useState("90%");
  // const [secondServeClicked, setSecondServeClicked] = useState(false);
  // const [secondServeColor, setSecondServeColor] = useState("grey");
  // const [secondServeScale, setSecondServeScale] = useState("100%");
  // const [letClicked, setLetClicked] = useState(false);
  // const [letColor, setLetColor] = useState("grey");
  // const [letScale, setLetScale] = useState("100%");
  // const [isPointInc, setIsPointInc] = useState(1);

  //serveCircle Data
  const [serveX, setServeX] = useState([]);
  const [serveY, setServeY] = useState([]);
  const [serveBallText, setServeBallText] = useState([]);

  //getting serveCircle Data from API
  const fetchServeData = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/serve_circles`)
      .then((response) => response.json())
      .then((output) => {
        setServeX(output["x"]);
        setServeY(output["y"]);
        setServeBallText(output["ball_text"]);
      })
      .catch((error) => console.error("Error:", error));
  };

  //server status related
  const [selectedServerValue, setSelectedServerValue] = useState("");

  const handleServerChange = (event) => {
    setSelectedServerValue(event.target.value);
  };

  // accessing data from API

  const fetchScoreboardData = () => {
    // Make an API request to FastAPI endpoint
    fetch(`${process.env.REACT_APP_BACKEND_URL}/scoreboard_data`)
      .then((response) => response.json())
      .then((output) => {
        setPlayer1(output["player1"]);
        setPlayer2(output["player2"]);
        setPrevSets1(output["prev_sets_1"]);
        setPrevSets2(output["prev_sets_2"]);
        setCurrSets1(output["curr_sets_1"]);
        setCurrSets2(output["curr_sets_2"]);
        setGames1(output["games_1"]);
        setGames2(output["games_2"]);
        setPoints1(output["points_1"]);
        setPoints2(output["points_2"]);
        setSelectedServerValue(output["server"]);
      })
      .catch((error) => console.error("Error:", error));
  };

  const [inputValues, setInputValues] = useState({
    date: new Date().toLocaleDateString(),
    // startTime: "",
    player1Name: "Koji Tanaka",
    player2Name: "Player 2",
  });

  useEffect(() => {
    const n = serveX.length;
    const tempServeCircles = [];
    for (let i = 0; i < n; i++) {
      console.log(serveX[i], serveY[i], serveBallText[i]);
      const x = serveX[i];
      const y = serveY[i];
      const ballText = serveBallText[i];
      const newServeCircle = { x, y, ballText };
      console.log(newServeCircle);
      tempServeCircles.push(newServeCircle);
      console.log(serveCircles.length);
    }
    setServeCircles(tempServeCircles);
  }, [serveX, serveY, serveBallText]);

  useEffect(() => {
    setInterval(fetchScoreboardData, 1000);
    setInterval(fetchServeData, 1000);
  }, []);

  // activate once I can make it so that the serve circles and points update at different times, not just when the refresh button is pressed.
  // useEffect(() => {
  //   setServeCircles([]);
  // }, [points1, points2]);

  const [winner, setWinner] = useState("");

  const [isEndResultOpen, setIsEndResultOpen] = useState(false);

  useEffect(() => {
    setSets1(sets1.slice(0, -1));
    setSets2(sets2.slice(0, -1));
  }, [isEndResultOpen]);

  const handleCloseEndReult = () => {
    setIsEndResultOpen(false);
  };

  // combine prev sets and games
  useEffect(() => {
    setSets1([...prevSets1, games1]);
    setSets2([...prevSets2, games2]);
  }, [games1, games2]);

  return (
    <div>
      <h1 className="tennis-score-observer">
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

      <div className="data-table-observer">
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
      <div className="section2-observer">
        <div className="tennis-court-image-observer">
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
      </div>
    </div>
  );
};

export default Observer;
