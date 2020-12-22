import React, { useContext } from "react";

import ProductListItem from "../ProductListItem/ProductListItem";
import Button from "../../../shared/UI Elements/Button/Button";
import Spinner from "../../../shared/UI Elements/Spinner/Spinner";
import Card from "../../../shared/UI Elements/Card/Card";
import { AuthContext } from "../../../shared/utils/context/authContext";
import { useFetch } from "../../../shared/hooks/fetch-hook";

import "./ProductsList.css";

const ProductsList = (props) => {
  const { userId } = useContext(AuthContext);
  const { isLoading } = useFetch();

  if (props.products.length === 0 && userId === props.userId) {
    return (
      <React.Fragment>
        {isLoading && <Spinner overlay />}
        {!isLoading && (
          <Card empty>
            <h2>You Have No Products :(</h2>
            <p>Maybe add some products to our site?</p>
            <Button href="/add-product" button>
              Add Products
            </Button>
          </Card>
        )}
      </React.Fragment>
    );
  } else if (props.products.length === 0) {
    return (
      <React.Fragment>
        {isLoading && <Spinner overlay />}
        {!isLoading && (
          <Card empty>
            <h2>No Products Found :(</h2>
          </Card>
        )}
      </React.Fragment>
    );
  }

  return (
    <ul className="products-list">
      {props.products.map((product) => {
        return (
          <ProductListItem
            key={product._id}
            id={product._id}
            title={product.title}
            description={product.description}
            imageUrl={product.imageUrl}
            price={product.price}
            creator={product.creator}
            onDelete={props.onDelete}
          />
        );
      })}
    </ul>
  );
};

export default ProductsList;
