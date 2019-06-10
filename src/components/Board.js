import React, { useState } from "react";
import PropTypes from "prop-types";
import Cell from "./Cell";

// Grid state
const useGrid = (size, playerPosition, spritesNumber) => {
  const [grid, setGrid] = useState(() => {
    let initialGrid = [];

    // initialize grid
    for (let r = 0; r < size.width; ++r) {
      initialGrid[r] = [];
      for (let c = 0; c < size.height; ++c) {
        initialGrid[r][c] = "";
      }
    }

    // set initial player position in the grid
    const [r, c] = playerPosition;
    initialGrid[r][c] = "player";

    // set sprites positions randomly in the grid
    for (let n = 0; n < spritesNumber; ++n) {
      let r = Math.floor(Math.random() * (size.width - 1));
      let c = Math.floor(Math.random() * (size.height - 1));
      // choose a new random row and col if the current row and col are occupied
      while (initialGrid[r][c] !== "") {
        r = Math.floor(Math.random() * (size.width - 1));
        c = Math.floor(Math.random() * (size.height - 1));
      }
      initialGrid[r][c] = "sprite";
    }

    return initialGrid;
  });

  return [grid, setGrid];
};

// player state
const usePlayer = initialPosition => {
  const [playerPosition, setPlayerPosition] = useState(initialPosition);
  const [moves, setMoves] = useState(0);

  return [
    playerPosition,
    args => {
      setPlayerPosition(args);
      setMoves(moves + 1);
    },
    moves
  ];
};

// Board component
const Board = ({ width, height }) => {
  // set player
  const [playerPosition, setPlayerPosition, moves] = usePlayer([
    Math.floor(width / 2), //row
    Math.floor(height / 2) //col
  ]);

  // set sprites
  const [spritesNumber, setSpritesNumber] = useState((width + height) / 2);

  // set grid
  const [grid, setGrid] = useGrid(
    { width, height },
    playerPosition,
    spritesNumber
  );

  // move player to new position
  const movePlayerTo = ([newRow, newCol]) => {
    // skip movement if the new position row or col are greater than or equal the board width or height
    if (newRow >= width || newCol >= height || newCol < 0 || newRow < 0) return;

    // get current player position
    const [currentRow, currentCol] = playerPosition;

    // copy the newGrid for immutability
    const newGrid = [...grid].map(row => [...row].map(col => col));

    // empty the player current position
    newGrid[currentRow][currentCol] = "";

    // if the new position has a sprite => decrease number of sprites
    if (newGrid[newRow][newCol] === "sprite")
      setSpritesNumber(spritesNumber - 1);

    // set the player position in the board grid
    newGrid[newRow][newCol] = "player";

    // set new player position
    setPlayerPosition([newRow, newCol]);

    setGrid(newGrid);
  };

  // arrow keys listeners
  document.onkeydown = e => {
    if (spritesNumber > 0) {
      const [currentRow, currentCol] = playerPosition;
      if (e.key === "ArrowUp") {
        movePlayerTo([currentRow - 1, currentCol]);
      } else if (e.key === "ArrowDown") {
        movePlayerTo([currentRow + 1, currentCol]);
      } else if (e.key === "ArrowRight") {
        movePlayerTo([currentRow, currentCol + 1]);
      } else if (e.key === "ArrowLeft") {
        movePlayerTo([currentRow, currentCol - 1]);
      }
    }
  };

  return (
    <>
      <p>moves: {moves}</p>
      {spritesNumber !== 0 ? (
        <table cellSpacing="0" style={{ border: "1px solid black" }}>
          <tbody>
            {grid.map((row, i) => (
              <tr key={i + "_" + Math.random()}>
                {row.map((col, j) => (
                  <td
                    key={i + "_" + j + "_" + Math.random()}
                    style={{
                      overflow: "hidden",
                      width: "50px",
                      height: "50px",
                      border: "1px solid black"
                    }}
                  >
                    <Cell>{col}</Cell>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <p>Game Over, your total steps are {moves}</p>
          <button onClick={() => window.location.reload()}>Play Again</button>
        </>
      )}
    </>
  );
};

Board.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export default Board;
