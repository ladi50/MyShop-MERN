import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ProductsList from "../../components/ProductsList/ProductsList";
import Spinner from "../../../shared/UI Elements/Spinner/Spinner";
import { AuthContext } from "../../../shared/utils/context/authContext";
import { useFetch } from "../../../shared/hooks/fetch-hook";

const UserProducts = () => {
  const userId = useParams().userId;
  const [products, setProducts] = useState([]);
  const { token } = useContext(AuthContext);
  const { fetchHandler, isLoading } = useFetch();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const getUserProducts = async () => {
      try {
        const resData = await fetchHandler(
          `${process.env.REACT_APP_BACKEND_URL}/products/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          },
          signal
        );

        if (resData) {
          setProducts(resData.products);
        }
      } catch (err) {
        throw new Error("Failed to get products!");
      }
    };

    getUserProducts();

    return () => controller.abort();
  }, [fetchHandler, token, userId]);

  const deletedProductHandler = (prodId) => {
    setProducts((prevProds) =>
      prevProds.filter((p) => p._id.toString() !== prodId)
    );
  };

  return (
    <React.Fragment>
      {isLoading && <Spinner overlay />}
      {!isLoading && (
        <ProductsList
          userId={userId}
          products={products}
          onDelete={deletedProductHandler}
        />
      )}
    </React.Fragment>
  );
};

export default UserProducts;
