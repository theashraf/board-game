import React, { memo } from "react";
import PropTypes from "prop-types";
import player from "../assets/img/mario.jpg";
import sprite from "../assets/img/sprite.jpg";

const Cell = ({ children }) => {
  return (
    children && (
      <img
        src={
          children === "player" ? player : children === "sprite" ? sprite : ""
        }
        alt={children}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    )
  );
};

Cell.propTypes = {
  children: PropTypes.oneOf(["player", "sprite", ""]).isRequired
};

export default memo(Cell);
