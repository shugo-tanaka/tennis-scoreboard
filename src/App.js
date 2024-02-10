import { useState } from "react";
import "./App.css";

function App() {
  const [prevSets1, setPrevSets1] = useState([]);
  const [player1, setPlayer1] = useState("Koji Tanaka");
  const [currSets1, setCurrSets1] = useState(0);
  const [games1, setGames1] = useState(0);
  const [points1, setPoints1] = useState(0);

  const [prevSets2, setPrevSets2] = useState([]);
  const [player2, setPlayer2] = useState("Masa Tanaka");
  const [currSets2, setCurrSets2] = useState(0);
  const [games2, setGames2] = useState(0);
  const [points2, setPoints2] = useState(0);

  const [serveCircles, setServeCircles] = useState([]);

  const [firstServeClicked, setFirstServeClicked] = useState(false);
  const [firstServeColor, setFirstServeColor] = useState("white");
  const [secondServeClicked, setSecondServeClicked] = useState(false);
  const [secondServeColor, setSecondServeColor] = useState("white");
  const [letClicked, setLetClicked] = useState(false);
  const [letColor, setLetColor] = useState("white");
  const [nonServeClicked, setNonServeClicked] = useState(false);
  const [nonServeColor, setNonServeColor] = useState("white");

  const incPoints1 = () => {
    if (points1 === 0) {
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
  };

  const incGames1 = () => {
    if (games1 < 6) {
      setGames1((set) => set + 1);
    } else {
      incSets1();
      addPrevSets1();
      addPrevSets2();
      setGames1(0);
      setGames2(0);
    }
  };

  const incSets1 = () => {
    setCurrSets1((set) => set + 1);
  };

  const addPrevSets1 = () => {
    let newSet = [...prevSets1];
    newSet.push(games1);
    setPrevSets1(newSet);
  };

  const incPoints2 = () => {
    if (points2 === 0) {
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
  };

  const incGames2 = () => {
    if (games2 < 6) {
      setGames2((set) => set + 1);
    } else {
      incSets2();
      addPrevSets1();
      addPrevSets2();
      setGames1(0);
      setGames2(0);
    }
  };

  const incSets2 = () => {
    setCurrSets2((set) => set + 1);
  };

  const addPrevSets2 = () => {
    let newSet = [...prevSets2];
    newSet.push(games2);
    setPrevSets2(newSet);
  };

  const handleImageClick = (event) => {
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();

    // Calculate the adjusted coordinates
    const x = event.clientX - rect.left - 5;
    const y = event.clientY - rect.top - 5;

    const ballColor = firstServeClicked
      ? "red"
      : secondServeClicked
      ? "blue"
      : letClicked
      ? "black"
      : nonServeClicked
      ? "#dfff4f"
      : "#dfff4f";

    console.log("Ball Color:", ballColor);

    const newServeCircle = { x, y, background: ballColor };

    setServeCircles([...serveCircles, newServeCircle]);
    //create a pop-up that can record if click was first serve, second serve, let, last position of ball
  };

  const undo = () => {
    const tempServeCircles = [...serveCircles];
    tempServeCircles.pop();
    setServeCircles(tempServeCircles);
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
          <div
            className="player-points"
            onClick={() => {
              incPoints1();
            }}
          >
            {points1}
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
          <div
            className="player-points"
            onClick={() => {
              incPoints2();
            }}
          >
            {points2}
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
                backgroundColor: circle.background,
              }}
            ></div>
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
              setNonServeClicked(false);
              setSecondServeColor("white");
              setLetColor("white");
              setNonServeColor("white");
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
              setNonServeClicked(false);
              setFirstServeColor("white");
              setLetColor("white");
              setNonServeColor("white");
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
              setNonServeClicked(false);
              setSecondServeColor("white");
              setFirstServeColor("white");
              setNonServeColor("white");
            }}
            style={{
              backgroundColor: letColor,
            }}
          >
            Let
          </div>
          <div
            className="non-serve"
            onClick={() => {
              setNonServeClicked(!nonServeClicked);
              setNonServeColor(nonServeClicked ? "white" : "grey");
              setSecondServeClicked(false);
              setLetClicked(false);
              setFirstServeClicked(false);
              setSecondServeColor("white");
              setLetColor("white");
              setFirstServeColor("white");
            }}
            style={{
              backgroundColor: nonServeColor,
            }}
          >
            Non-Serve
          </div>
          <div className="undo" onClick={undo}>
            Undo
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
