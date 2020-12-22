import React, { useContext } from "react";

import Button from "../../UI Elements/Button/Button";
import { AuthContext } from "../../utils/context/authContext";

import "./HomePage.css";

const HomePage = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div>
      <header className="homepage-header">
        <h2 className="homepage-title">Welcome to My Shop!</h2>
        <p className="homepage-description">
          Everything u ever wanted to buy, can be found here!
        </p>
        <Button button success href="/products">
          View Our Products
        </Button>
        {!isLoggedIn ? (
          <div>
            <h3 className="homepage-description">Sign Up or Log In</h3>
            <Button button href="/signup">
              Sign Up
            </Button>
            <Button button href="/login">
              Log In
            </Button>
          </div>
        ) : (
          <Button button href="/cart">
            View Your Cart
          </Button>
        )}
      </header>
    </div>
  );
};

export default HomePage;
