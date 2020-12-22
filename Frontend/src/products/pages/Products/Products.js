import React, { useState, useEffect, useContext } from "react";

import ProductsList from "../../components/ProductsList/ProductsList";
import Spinner from "../../../shared/UI Elements/Spinner/Spinner";
import { useFetch } from "../../../shared/hooks/fetch-hook";
import { AuthContext } from "../../../shared/utils/context/authContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { fetchHandler, isLoading } = useFetch();
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const getProducts = async () => {
      try {
        const resData = await fetchHandler(
          `${process.env.REACT_APP_BACKEND_URL}/products`,
          {},
          signal
        );

        if (resData) {
          const filteredProducts = resData.products.filter(
            (p) => p.creator.toString() !== userId
          );

          setProducts(filteredProducts);
        }
      } catch (err) {
        throw new Error("Failed to get products!");
      }
    };

    getProducts();

    return () => {
      if (document.querySelector("div.alert-div")) {
        document.querySelector("div.alert-div").style.display = "none";
      }
      controller.abort();
    }
  }, [fetchHandler, userId]);

  return (
    <React.Fragment>
      {isLoading && <Spinner overlay />}
      <ProductsList products={products} />
    </React.Fragment>
  );
};

export default Products;
