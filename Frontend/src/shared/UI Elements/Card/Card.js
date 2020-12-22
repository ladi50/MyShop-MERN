import React from "react";

import "./Card.css";

const Card = (props) => {
  let className = "card-div";
  
  if (props.cartItem) {
    className = "card__cartItem-div"
  }
  if (props.empty) {
    className = "card__empty-message-div"
  }
  if (props.cart) {
    className = className + " empty-cartMessage"
  }
  
  return <div className={className}>{props.children}</div>;
};

export default Card;
