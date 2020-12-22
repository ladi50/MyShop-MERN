import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

const Button = (props) => {
  let buttonClass = "button normalButton";

  if (props.danger) {
    buttonClass = "button deleteButton";
  }
  if (props.success) {
    buttonClass = "button orderButton";
  }
  if (props.edit) {
    buttonClass = "button editButton";
  }
  if (props.order) {
    buttonClass = buttonClass + " cart-item-order-button"
  }
  if (props.medium) {
    buttonClass = buttonClass + " mediumButton";
  }
  if (props.large) {
    buttonClass = buttonClass + " largeButton";
  }

  if (props.href) {
    return (
      <Link to={{ pathname: props.href, state: props.state && props.state }}>
        <button className={buttonClass} type={props.type}>
          {props.children}
        </button>
      </Link>
    );
  }

  return (
    <button className={buttonClass} type={props.type} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default Button;
