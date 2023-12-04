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

  const incPoints1 = () => {
    if (points1 === 0) {
      setPoints1(15);
    } else if (points1 === 15) {
      setPoints1(30);
    } else if (points1 === 30) {
      setPoints1(40);
    } else {
      incSets1();
      setPoints1(0);
    }
  };

  const incSets1 = () => {
    if (currSets1 < 6) {
      setCurrSets1((set) => set + 1);
    } else {
      addPrevSets1();
      setCurrSets1(0);
    }
  };

  const addPrevSets1 = () => {
    let newSet = [...prevSets1];
    newSet.push(currSets1);
    setPrevSets1(newSet);
  };

  const incPoints2 = () => {
    if (points2 === 0) {
      setPoints2(15);
    } else if (points2 === 15) {
      setPoints2(30);
    } else if (points2 === 30) {
      setPoints2(40);
    } else {
      incSets2();
      setPoints2(0);
    }
  };

  const incSets2 = () => {
    if (currSets2 < 6) {
      setCurrSets2((set) => set + 1);
    } else {
      addPrevSets2();
      setCurrSets2(0);
    }
  };

  const addPrevSets2 = () => {
    let newSet = [...prevSets2];
    newSet.push(currSets2);
    setPrevSets2(newSet);
  };

  return (
    <div>
      <h1>Tennis Score</h1>
      <div>
        <div>
          <div>Previous Sets</div>
          <div>Sets</div>
          <div>Games1</div>
          <div>Points1</div>
        </div>
        <div>
          {/*player1 1*/}
          <div>
            {prevSets1.map((set) => {
              return <div>{set}</div>;
            })}
          </div>
          <div>{player1}</div>
          <div>{currSets1}</div>
          <div>{games1}</div>
          <button
            onClick={() => {
              incPoints1();
            }}
          >
            {points1}
          </button>
        </div>
        <div>
          {/*player two*/}
          <div>
            {prevSets2.map((set) => {
              return <div>{set}</div>;
            })}
          </div>
          <div>{player2}</div>
          <div>{currSets2}</div>
          <div>{games2}</div>
          <button
            onClick={() => {
              incPoints2();
            }}
          >
            {points2}
          </button>
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
