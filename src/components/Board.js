import React, { useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import Cell from "./Cell";

// board state initializer
const initialState = (width, height) => {
  let grid = [];
  const sprites = (width + height) / 2;
  const playerPosition = {
    row: Math.floor(width / 2),
    col: Math.floor(height / 2)
  };

  // initialize grid
  for (let r = 0; r < width; ++r) {
    grid[r] = [];
    for (let c = 0; c < height; ++c) {
      if (r === playerPosition.row && c === playerPosition.col) {
        grid[r][c] = "player";
        continue;
      }
      grid[r][c] = "";
    }
  }

  // set sprites positions randomly in the grid
  for (let n = 0; n < sprites; ++n) {
    let r = Math.floor(Math.random() * (width - 1));
    let c = Math.floor(Math.random() * (height - 1));
    // choose a new random row and col if the current row and col are occupied
    while (grid[r][c] !== "") {
      r = Math.floor(Math.random() * (width - 1));
      c = Math.floor(Math.random() * (height - 1));
    }
    grid[r][c] = "sprite";
  }

  return {
    grid,
    sprites,
    playerPosition,
    moves: 0,
    size: { width, height }
  };
};

// board component reducer
const boardReducer = (state, action) => {
  let { grid, playerPosition, moves, sprites, size } = state;

  // new player position
  const newPlayerPosition = {
    ...playerPosition
  };

  switch (action.type) {
    case "MOVE_UP":
      newPlayerPosition.row--;
      if (newPlayerPosition.row < 0) return state;
      break;
    case "MOVE_DOWN":
      newPlayerPosition.row++;
      if (newPlayerPosition.row >= size.width) return state;
      break;
    case "MOVE_LEFT":
      newPlayerPosition.col--;
      if (newPlayerPosition.col < 0) return state;
      break;
    case "MOVE_RIGHT":
      newPlayerPosition.col++;
      if (newPlayerPosition.col >= size.height) return state;
      break;
    default:
      return state;
  }

  // empty the player current position
  grid[playerPosition.row][playerPosition.col] = "";

  // if the new position has a sprite => decrease number of sprites
  if (grid[newPlayerPosition.row][newPlayerPosition.col] === "sprite")
    --sprites;

  // set the new player position in the board
  grid[newPlayerPosition.row][newPlayerPosition.col] = "player";
  ++moves;

  return {
    ...state,
    grid,
    moves,
    sprites,
    playerPosition: newPlayerPosition
  };
};

// Board component
const Board = ({ width, height }) => {
  const [{ grid, sprites, moves }, dispatch] = useReducer(
    boardReducer,
    initialState(width, height)
  );

  useEffect(() => {
    window.addEventListener("keyup", e => {
      if (e.key === "ArrowUp") {
        dispatch({ type: "MOVE_UP" });
      } else if (e.key === "ArrowDown") {
        dispatch({ type: "MOVE_DOWN" });
      } else if (e.key === "ArrowRight") {
        dispatch({ type: "MOVE_RIGHT" });
      } else if (e.key === "ArrowLeft") {
        dispatch({ type: "MOVE_LEFT" });
      }
    });
    return () => {
      window.removeEventListener("keyup");
    };
  }, []);

  return (
    <>
      <p>player moves: {moves}</p>
      <p>Sprites left: {sprites}</p>
      {sprites !== 0 ? (
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
