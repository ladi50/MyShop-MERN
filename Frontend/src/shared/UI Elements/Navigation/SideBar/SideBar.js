import React, { forwardRef } from "react";
import { NavLink } from "react-router-dom";

import SideBarLinks from "./SideBarLinks/SideBarLinks";

import "./SideBar.css";

const SideBar = forwardRef((props, ref) => {
  return (
    <React.Fragment>
      <div ref={ref} className="sideBar-div">
        <h1 className="nav-title" onClick={props.onClick}>
          <NavLink to="/" exact>
            MyShop
          </NavLink>
        </h1>
        <SideBarLinks onClick={props.onClick} />
      </div>
    </React.Fragment>
  );
});

export default SideBar;
