import React, { useContext, useEffect, useState } from "react";
import {} from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

import Card from "../../../shared/UI Elements/Card/Card";
import Spinner from "../../../shared/UI Elements/Spinner/Spinner";
import Button from "../../../shared/UI Elements/Button/Button";
import { useFetch } from "../../../shared/hooks/fetch-hook";
import { AuthContext } from "../../../shared/utils/context/authContext";

import "./Cart.css";

const stripePromise = loadStripe(
  `${process.env.REACT_APP_STRIPE_PUBLISH_API_KEY}`
);

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { fetchHandler, isLoading } = useFetch();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const getCartItemsHandler = async () => {
      try {
        const resData = await fetchHandler(
          `${process.env.REACT_APP_BACKEND_URL}/products/cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal
          }
        );

        if (resData) {
          setCartItems(resData.cart);
        }
      } catch (err) {
        throw new Error(err);
      }
    };

    getCartItemsHandler();

    return () => {
      controller.abort();
    };
  }, [fetchHandler, token]);

  const deleteCartProdHandler = async (e) => {
    let prodId;
    const CartItemNodes = e.target.parentNode.childNodes;

    for (let itemNode of CartItemNodes) {
      if (itemNode.type === "hidden") {
        prodId = itemNode.value;
      }
    }

    try {
      const resData = await fetchHandler(
        `${process.env.REACT_APP_BACKEND_URL}/products/cart/${prodId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (resData) {
        setCartItems((prevCart) =>
          prevCart.filter((item) => item.productId._id.toString() !== prodId)
        );
        console.log("Product removed from cart!");
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  const checkoutHandler = async () => {
    try {
      const stripe = await stripePromise;

      const resData = await fetchHandler(
        `${process.env.REACT_APP_BACKEND_URL}/products/checkout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (resData) {
        const result = await stripe.redirectToCheckout({
          sessionId: resData.id
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  if (cartItems.length === 0) {
    return (
      <React.Fragment>
        {isLoading && <Spinner overlay />}
        {!isLoading && (
          <Card empty cart>
            <h2>Your Cart Is Empty :(</h2>
            <p>Maybe add some products to your cart?</p>
            <Button href="/products" button>
              Buy Products
            </Button>
          </Card>
        )}
      </React.Fragment>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <ul className="cart-list">
        {isLoading && <Spinner overlay />}
        {!isLoading &&
          cartItems.map((item) => {
            return (
              <li key={item.productId._id} className="cart-list-item">
                <Card cartItem>
                  <input type="hidden" value={item.productId._id} />
                  <h2 className="cartItem-title">{item.productId.title}</h2>
                  <p>Quantity: {item.quantity}</p>
                  <p className="cartItem-price">
                    Price: ${item.quantity * item.productId.price}
                  </p>
                  <Button onClick={deleteCartProdHandler} button danger>
                    Delete
                  </Button>
                </Card>
              </li>
            );
          })}
      </ul>
      <hr />
      <Button button order medium onClick={checkoutHandler}>
        Checkout
      </Button>
    </div>
  );
};

export default Cart;
