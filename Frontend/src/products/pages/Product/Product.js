import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Button from "../../../shared/UI Elements/Button/Button";
import Spinner from "../../../shared/UI Elements/Spinner/Spinner";
import Card from "../../../shared/UI Elements/Card/Card";
import { useFetch } from "../../../shared/hooks/fetch-hook";
import { AuthContext } from "../../../shared/utils/context/authContext";
import { useCart } from "../../../shared/hooks/cart-hook";

import "./Product.css";

const Product = () => {
  const [product, setProduct] = useState();
  const { prodId } = useParams();
  const { fetchHandler, isLoading } = useFetch();
  const { userId, token } = useContext(AuthContext);
  const { addToCartHandler } = useCart();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const getProduct = async () => {
      try {
        const resData = await fetchHandler(
          `${process.env.REACT_APP_BACKEND_URL}/products/product/${prodId}`,
          {},
          signal
        );

        if (resData) {
          setProduct(resData.product);
        }
      } catch (err) {
        throw new Error("Could not get product!");
      }
    };

    getProduct();

    return () => {
      if (document.querySelector("div.alert-div")) {
        document.querySelector("div.alert-div").style.display = "none";
      }
      controller.abort();
    };
  }, [fetchHandler, prodId]);

  if (!product) {
    return (
      <React.Fragment>
        {isLoading && <Spinner overlay />}
        {!isLoading && (
          <Card empty>
            <h2>Product Not Found :(</h2>
          </Card>
        )}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="product-page">
        <section>
          <h2 className="product-page__title">{product.title}</h2>
          <img
            className="product-page__image"
            src={`${product.imageUrl}`}
            width="70%"
            height="30%"
            alt={product.title}
          />
        </section>
        <section>
          <h3 className="product-page__title">Product Details:</h3>
          <p className="product-page__description">{product.description}</p>
          <p className="product-page__price">Price: ${product.price}</p>
        </section>
        {userId && token && (
          <div>
            <hr />
            <footer className="product-page__footer">
              <form>
                <Button
                  onClick={() => addToCartHandler(prodId)}
                  type="button"
                  success
                  large
                >
                  Add to Cart
                </Button>
              </form>
            </footer>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Product;
