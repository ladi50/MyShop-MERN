import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import DropMenu from "../DropMenu/DropMenu";
import { AuthContext } from "../../../utils/context/authContext";

import "./NavLinks.css";

const NavLinks = (props) => {
  const { userId, isLoggedIn } = useContext(AuthContext);

  let links = (
    <React.Fragment>
      <li className="navlink-li">
        <NavLink to="/products" exact>
          Products
        </NavLink>
      </li>
      <li className="navlink-li">
        <NavLink to="/signup" exact>
          Sign Up
        </NavLink>
      </li>
      <li className="navlink-li">
        <NavLink to="/login" exact>
          Log In
        </NavLink>
      </li>
    </React.Fragment>
  );

  if (isLoggedIn) {
    links = (
      <React.Fragment>
        <li className="navlink-li-loggedIn">
          <NavLink to="/products" exact>
            Products
          </NavLink>
        </li>
        <li className="navlink-li-loggedIn">
          <NavLink to={`/products/user/${userId}`} exact>
            My Products
          </NavLink>
        </li>
        <li className="navlink-li-loggedIn">
          <NavLink to="/add-product" exact>
            Add Product
          </NavLink>
        </li>
        <DropMenu />
      </React.Fragment>
    );
  }

  return <ul className="nav-links">{links}</ul>;
};

export default NavLinks;
