import React, { useContext } from "react";

import Card from "../../../shared/UI Elements/Card/Card";
import Button from "../../../shared/UI Elements/Button/Button";
import { AuthContext } from "../../../shared/utils/context/authContext";
import { useFetch } from "../../../shared/hooks/fetch-hook";
import { useCart } from "../../../shared/hooks/cart-hook";

import "./ProductListItem.css";
import Spinner from "../../../shared/UI Elements/Spinner/Spinner";

const ProductListItem = (props) => {
  const productId = props.id;
  const { userId, token } = useContext(AuthContext);
  const { fetchHandler, isLoading } = useFetch();
  const { addToCartHandler } = useCart();

  const deleteProductHandler = async (e) => {
    e.preventDefault();

    try {
      const resData = await fetchHandler(
        `${process.env.REACT_APP_BACKEND_URL}/products/product/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (resData) {
        console.log("Deleted product!");
        props.onDelete(props.id);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <li className="product-list-item">
      <Card>
        {isLoading && <Spinner overlay />}
        <header>
          <div className="list-item-title">
            <h2>{props.title}</h2>
          </div>
        </header>
        <div className="list-item_image">
          <img
            src={`${props.imageUrl}`}
            width="70%"
            height="190px"
            alt={props.title}
          />
        </div>
        <footer>
          <div className="list-item-content">
            <p>Price: ${props.price}</p>
          </div>
        </footer>
      </Card>
      <form>
        {userId === props.creator.toString() ? (
          <React.Fragment>
            <Button edit type="button" href={`/edit-product/${props.id}`}>
              Edit Product
            </Button>
            <Button onClick={deleteProductHandler} type="submit" danger>
              Delete
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Button type="button" href={`/products/${productId}`}>
              More Details
            </Button>
            {userId && token && (
              <Button
                onClick={() => addToCartHandler(props.id)}
                type="button"
                success
              >
                Add to Cart
              </Button>
            )}
          </React.Fragment>
        )}
      </form>
    </li>
  );
};

export default ProductListItem;
