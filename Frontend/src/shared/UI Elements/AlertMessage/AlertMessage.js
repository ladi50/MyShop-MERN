import { useRef } from "react";

import "./AlertMessage.css";

const AlertMessage = (props) => {
  const closeAlert = useRef();

  const closeAlertHandler = () => {
    closeAlert.current.style.display = "none";
  };

  return (
    <div className="alert-div" ref={closeAlert}>
      <span className="closeButton" onClick={closeAlertHandler}>
        &times;
      </span>
      <strong className="alert-message">Product added to cart!</strong>
    </div>
  );
};

export default AlertMessage;
