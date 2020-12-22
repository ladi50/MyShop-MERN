import { useCallback, useContext } from "react";

import { useFetch } from "../hooks/fetch-hook";
import { AuthContext } from "../utils/context/authContext";

export const useCart = () => {
  const { fetchHandler } = useFetch();
  const { token } = useContext(AuthContext);

  const addToCartHandler = useCallback(
    async (productId) => {
      try {
        const resData = await fetchHandler(
          `${process.env.REACT_APP_BACKEND_URL}/products/cart`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              productId
            })
          }
        );

        if (resData) {
          console.log("Product added to cart!");
          document.querySelector("div.alert-div").style.display = "block";
        }
      } catch (err) {
        document.querySelector("div.alert-div").style.display = "none";
        throw new Error(err);
      }
    },
    [fetchHandler, token]
  );

  return { addToCartHandler };
};
