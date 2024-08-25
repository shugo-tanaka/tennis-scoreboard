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
</div>;
