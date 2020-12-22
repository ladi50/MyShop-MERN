import React, { useState } from "react";

import "./Input.css";

const Input = (props) => {
  const [input, setInput] = useState("");
  const [emptyField, setEmptyField] = useState(false);

  const inputChangeHandler = (e) => {
    const { value } = e.target;
    setInput(value);

    props.data(e.target);
  };

  const blurHandler = (e) => {
    const { name, value } = e.target;

    if (name === "password" && value.length < 6) {
      setEmptyField(true);
      document
        .querySelector(`input[name=${name}]`)
        .style.setProperty("--c", "rgb(233, 19, 19)");
    } else if (name !== "password" && value.length === 0) {
      setEmptyField(true);
      if (props.textarea) {
        document
          .querySelector(`textarea[name=${name}]`)
          .style.setProperty("--c", "rgb(233, 19, 19)");
      } else {
        document
          .querySelector(`input[name=${name}]`)
          .style.setProperty("--c", "rgb(233, 19, 19)");
      }
    } else {
      setEmptyField(false);
      if (props.textarea) {
        document
          .querySelector(`textarea[name=${name}]`)
          .style.setProperty("--c", "black");
      } else {
        document
          .querySelector(`input[name=${name}]`)
          .style.setProperty("--c", "black");
      }
    }
  };

  let elementProps = {
    className: `input ${props.hidden && "hidden"} ${
      emptyField && props.textarea
        ? "textarea-error"
        : emptyField && "red-input"
    } ${props.textarea && "textarea"}`,
    type: props.type,
    placeholder: props.placeholder,
    value: input,
    name: props.name,
    onChange: inputChangeHandler,
    onBlur: blurHandler,
    ref: props.ref,
    autoFocus: props.focus && true,
    min: "1",
    step: "0.01"
  };

  let element = <input {...elementProps} />;

  if (props.textarea) {
    element = <textarea {...elementProps} />;
  }

  return (
    <div>{element}</div>
  );
};

export default Input;
