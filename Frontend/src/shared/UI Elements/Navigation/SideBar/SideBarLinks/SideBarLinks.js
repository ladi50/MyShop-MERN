import React, { useContext } from "react";
import {NavLink} from "react-router-dom"

import "./SideBarLinks.css";

import { AuthContext } from "../../../../utils/context/authContext";

const SideBarLinks = (props) => {
  const { isLoggedIn, userId, logout } = useContext(AuthContext);

  const logoutHandler = () => {
    logout();
  };

  let links = (
    <React.Fragment>
      <li onClick={props.onClick} className="navlink-li-mobile">
        <NavLink to="/products" exact>
          Products
        </NavLink>
      </li>
      <li onClick={props.onClick} className="navlink-li-mobile">
        <NavLink to="/signup" exact>
          Sign Up
        </NavLink>
      </li>
      <li onClick={props.onClick} className="navlink-li-mobile">
        <NavLink to="/login" exact>
          Log In
        </NavLink>
      </li>
    </React.Fragment>
  );

  if (isLoggedIn) {
    links = (
      <React.Fragment>
        <li onClick={props.onClick} className="navlink-li-loggedIn-mobile">
          <NavLink to="/products" exact>
            Products
          </NavLink>
        </li>
        <li onClick={props.onClick} className="navlink-li-loggedIn-mobile">
          <NavLink to={`/products/user/${userId}`} exact>
            My Products
          </NavLink>
        </li>
        <li onClick={props.onClick} className="navlink-li-loggedIn-mobile">
          <NavLink to="/add-product" exact>
            Add Product
          </NavLink>
        </li>
        {/* <li onClick={props.onClick} className="navlink-li-loggedIn-mobile">
          <NavLink to="/profile" exact>
            My Profile
          </NavLink>
        </li> */}
        <li onClick={props.onClick} className="navlink-li-loggedIn-mobile">
          <NavLink to="/cart" exact>
            Cart
          </NavLink>
        </li>
        <li onClick={props.onClick} className="navlink-li-loggedIn-mobile">
          <NavLink to="/orders" exact>
            Orders
          </NavLink>
        </li>
        <li onClick={props.onClick} className="sideBar-logout-button">
          <button onClick={logoutHandler} type="button">
            Logout
          </button>
        </li>
      </React.Fragment>
    );
  }

  return <ul className="nav-links-mobile">{links}</ul>;
};

export default SideBarLinks;
