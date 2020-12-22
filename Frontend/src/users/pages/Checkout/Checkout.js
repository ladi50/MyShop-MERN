import { useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import Spinner from "../../../shared/UI Elements/Spinner/Spinner";
import { useFetch } from "../../../shared/hooks/fetch-hook";
import { AuthContext } from "../../../shared/utils/context/authContext";

const Checkout = () => {
  const { isLoading, fetchHandler, error } = useFetch();
  const { token } = useContext(AuthContext);

  let history = useHistory();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const createOrder = async () => {
      const resData = await fetchHandler(
        `${process.env.REACT_APP_BACKEND_URL}/products/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          signal
        }
      );

      if (resData) {
        setTimeout(() => {
          history.push("/orders");
        }, 3500);
      }
    };

    createOrder();

    return () => {
      controller.abort();
    };
  }, [fetchHandler, token, history]);

  return (
    <div
      style={{
        width: "90%",
        margin: "100px auto 0",
        textAlign: "center",
        fontWeight: "bold"
      }}
    >
      {isLoading && <Spinner overlay checkout />}
      {!isLoading && (
        <div>
          {error && (
            <div>
              <h2 style={{ fontSize: "2rem", color: "red" }}>
                {error ||" Something went wrong!"}
              </h2>
              <p>
                Try to check if your cart is empty.
                <br />
                If you still have problems, please email to:{" "}
                <Link to="mailto:orders@example.com">orders@example.com</Link>.
              </p>
            </div>
          )}
          {!error && !isLoading && (
            <div>
              <h2 style={{ fontSize: "2rem" }}>Thanks for your order!</h2>
              <p>
                We appreciate your business!
                <br />
                If you have any questions, please email to:{" "}
                <Link to="mailto:orders@example.com">orders@example.com</Link>.
                <br />
                You are redirected to your orders page...
              </p>
              <Spinner checkout />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkout;
