import React, { useState, createRef, useEffect } from "react";
import ReactDOM from "react-dom";

import NavHeader from "../NavHeader/NavHeader";
import SideBar from "../SideBar/SideBar";
import BackDrop from "../../Backdrop/Backdrop";

import "./NavBar.css";

const NavBar = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const openSideBar = createRef();

  const openSideBarHandler = () => {
    setShowSideBar((prevState) => !prevState);
  };

  useEffect(() => {
    if (showSideBar) {
      openSideBar.current.style.transform = "translateX(0vw)";
      document.querySelector("body").style.overflow = "hidden";
    } else {
      openSideBar.current.style.transform = "translateX(-100vw)";
      document.querySelector("body").style.overflow = "visible";
    }
  });

  const navbar = (
    <React.Fragment>
      {showSideBar && <BackDrop onClick={() => setShowSideBar(false)} />}
      <nav className="navbar_nav">
        <div>
          <span className="burgerMenu-button" onClick={openSideBarHandler}>
            <div></div>
            <div></div>
            <div></div>
          </span>
          <NavHeader />
        </div>
        <SideBar
          show={showSideBar}
          ref={openSideBar}
          onClick={openSideBarHandler}
        />
      </nav>
    </React.Fragment>
  );

  return ReactDOM.createPortal(navbar, document.getElementById("navbar"));
};

export default NavBar;
