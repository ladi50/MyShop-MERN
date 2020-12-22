import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom";

import Form from "../../../shared/Form/FormLayout/FormLayout";
import Input from "../../../shared/Form/Input/Input";
import Spinner from "../../../shared/UI Elements/Spinner/Spinner";
import { useError } from "../../../shared/hooks/error-hook";
import { useFetch } from "../../../shared/hooks/fetch-hook";
import { useData } from "../../../shared/hooks/data-hook";
import { AuthContext } from "../../../shared/utils/context/authContext";

import "./EditProduct.css";

const EditProduct = () => {
  const { errorHandler } = useError();
  const { fetchHandler, error, isLoading } = useFetch();
  const { dataHandler, inputsData } = useData();
  const { token, userId } = useContext(AuthContext);
  const { prodId } = useParams();

  const history = useHistory();

  const editProductHandler = async (e) => {
    e.preventDefault();

    try {
      const resData = await fetchHandler(
        `${process.env.REACT_APP_BACKEND_URL}/products/edit-product/${prodId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: inputsData.title,
            description: inputsData.description,
            price: inputsData.price
          })
        }
      );

      if (resData) {
        history.push(`/products/user/${userId}`);
        console.log("Updated product!");
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <Form
      onSubmit={editProductHandler}
      formTitle="Edit Product"
      buttonName="Edit Product"
    >
      {isLoading && <Spinner overlay />}
      {error && errorHandler(error)}
      {!isLoading && (
        <div>
          <Input
            type="text"
            name="title"
            placeholder="Enter a name for your product"
            focus
            data={dataHandler}
          />
          <Input
            textarea
            name="description"
            placeholder="Tell us about your product..."
            data={dataHandler}
          />
          <Input
            type="number"
            name="price"
            placeholder="How much does it cost?"
            data={dataHandler}
          />
        </div>
      )}
    </Form>
  );
};

export default EditProduct;
