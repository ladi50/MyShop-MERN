import React, { useContext, useState, useEffect } from "react";

import Spinner from "../../../shared/UI Elements/Spinner/Spinner";
import Button from "../../../shared/UI Elements/Button/Button";
import Card from "../../../shared/UI Elements/Card/Card";
import { useFetch } from "../../../shared/hooks/fetch-hook";
import { AuthContext } from "../../../shared/utils/context/authContext";

import "./Orders.css";
import arrowUp from "./arrow-up.png";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { fetchHandler, isLoading } = useFetch();
  const { userId, token } = useContext(AuthContext);

  useEffect(() => {
    const getUserOrders = async () => {
      try {
        const resData = await fetchHandler(
          `${process.env.REACT_APP_BACKEND_URL}/products/orders/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (resData) {
          setOrders(() =>
            resData.orders.map((order) => {
              return {
                order,
                show: false
              };
            })
          );
        }
      } catch (err) {
        throw new Error(err);
      }
    };

    getUserOrders();
  }, [fetchHandler, token, userId]);

  const openOrderDetailsHandler = (e) => {
    let newOrders = [...orders];
    let order = { ...orders[e.target.parentNode.parentNode.id] };
    order.show = !order.show;
    newOrders[e.target.parentNode.parentNode.id] = order;
    setOrders(newOrders);
  };

  if (orders.length === 0) {
    return (
      <React.Fragment>
        {isLoading && <Spinner overlay />}
        {!isLoading && (
          <Card empty>
            <h2>Your Have No Orders :(</h2>
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
    <div className="orders-page-div">
      {isLoading && <Spinner overlay />}
      {!isLoading &&
        orders.map((order, orderIndex) => {
          return (
            <div className="order-div" key={order.order._id}>
              <p className="order-number">Order: #{order.order._id}</p>
              <span className="span-open-order" id={orderIndex}>
                <i>
                  <img
                    className="arrow-image"
                    src={arrowUp}
                    onClick={(e) => openOrderDetailsHandler(e)}
                    alt="arrow"
                  />
                </i>
              </span>
              <div className="order-ul-div">
                {order.show &&
                  order.order.products.map((product) => {
                    return (
                      <div key={product._id}>
                        <ul>
                          <li className="order-listItem">
                            Product: {product.productId.title}
                          </li>
                          <li className="order-listItem">
                            Quantity: {product.quantity}
                          </li>
                          <li className="order-listItem">
                            Price: {product.quantity * product.productId.price}
                          </li>
                        </ul>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Orders;
