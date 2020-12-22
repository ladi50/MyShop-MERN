import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../../utils/context/authContext";

import "./DropMenu.css";

const DropMenu = () => {
  const { logout, username } = useContext(AuthContext);

  const logoutHandler = () => {
    logout();
  };

  return (
    <li className="drop-menu-list">
      <h2>Hello {username}</h2>
      <ul className="nav__drop-menu-links">
        <li className="nav__drop-menu-item">
          <NavLink to="/profile" exact>
            My Profile
          </NavLink>
        </li>
        <li className="nav__drop-menu-item">
          <NavLink to="/cart" exact>
            Cart
          </NavLink>
        </li>
        <li className="nav__drop-menu-item">
          <NavLink to="/orders" exact>
            Orders
          </NavLink>
        </li>
        <li className="nav__drop-menu-item logout">
          <button onClick={logoutHandler} type="button">
            Logout
          </button>
        </li>
      </ul>
    </li>
  );
};

export default DropMenu;
