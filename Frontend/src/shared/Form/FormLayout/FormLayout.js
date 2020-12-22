import React from "react";

import Button from "../../UI Elements/Button/Button";

import "./FormLayout.css";

const FormLayout = (props) => {
  return (
    <form className="form" onSubmit={props.onSubmit}>
      <header>
        <h2 className="form-title">{props.formTitle}</h2>
      </header>
      {props.children}
      <Button medium type="submit">
        {props.buttonName}
      </Button>
    </form>
  );
};

export default FormLayout;
