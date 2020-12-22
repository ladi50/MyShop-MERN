import React from "react";
import { NavLink } from "react-router-dom";

import NavLinks from "../NavLinks/NavLinks";

import "./NavHeader.css";

const NavHeader = (props) => {
  return (
    <React.Fragment>
      <div className="nav-header">
        <h1 className="nav-title">
          <NavLink to="/" exact>MyShop</NavLink>
        </h1>
        <NavLinks />
      </div>
    </React.Fragment>
  );
};

export default NavHeader;
