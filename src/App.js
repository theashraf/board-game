import React, { useState, useEffect } from "react";
import Board from "./components/Board";

const App = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(parseInt(prompt("Please enter board width:")));
    setHeight(parseInt(prompt("Please enter board height:")));
  }, []);

  return (
    <div className="App">
      {width && height ? (
        <Board width={width} height={height} />
      ) : (
        <>
          <p>Provide a valid board width & height</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </>
      )}
    </div>
  );
};

export default App;
