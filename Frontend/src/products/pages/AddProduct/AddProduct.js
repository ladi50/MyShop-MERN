import React, { useRef, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import Form from "../../../shared/Form/FormLayout/FormLayout";
import Input from "../../../shared/Form/Input/Input";
import Button from "../../../shared/UI Elements/Button/Button";
import Spinner from "../../../shared/UI Elements/Spinner/Spinner";
import { useFetch } from "../../../shared/hooks/fetch-hook";
import { AuthContext } from "../../../shared/utils/context/authContext";
import { useData } from "../../../shared/hooks/data-hook";
import { useError } from "../../../shared/hooks/error-hook";

import "./AddProduct.css";

const AddProduct = () => {
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState();
  const { dataHandler, inputsData } = useData();
  const { token, userId } = useContext(AuthContext);
  const addImage = useRef();
  const { fetchHandler, error, isLoading } = useFetch();
  const { errorHandler } = useError();

  let history = useHistory();

  const addPictureHandler = () => {
    addImage.current.click();
  };

  const pickImageHandler = (e) => {
    if (e.target.files && e.target.files.length === 1) {
      setImage(e.target.files[0]);
    }
    if (!e.target.files || e.target.files.length === 0) {
      setImage(null);
      setImageUrl(null);
    }
  };

  useEffect(() => {
    if (!image) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(image);

    if (fileReader.error) {
      throw new Error("Could not upload your picture! Please try again.");
    }

    fileReader.onloadend = () => {
      setImageUrl(fileReader.result);
    };
  }, [image]);

  const addProductHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", inputsData.title);
    formData.append("description", inputsData.description);
    formData.append("price", inputsData.price);
    formData.append("imageUrl", image);

    try {
      const resData = await fetchHandler(
        `${process.env.REACT_APP_BACKEND_URL}/products/user/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      if (resData) {
        console.log("Product Created!");
        history.push(`/products/user/${userId}`);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <Form
      onSubmit={addProductHandler}
      formTitle="Add Product"
      buttonName="Add Product"
    >
      {isLoading && <Spinner overlay />}
      {error && errorHandler(error)}
      {!isLoading && (
        <div>
          <input
            ref={addImage}
            type="file"
            name="file"
            accept=".png, .jpeg, .jpg"
            hidden
            onChange={pickImageHandler}
          />
          <img
            src={imageUrl}
            className="form__product-image"
            width="120px"
            height="110px"
            alt="imagePreview"
          />
          <Button type="button" success onClick={addPictureHandler}>
            Add Image
          </Button>
          <Input
            type="text"
            name="title"
            placeholder="Enter a name for your product"
            data={dataHandler}
            focus
          />
          <Input
            textarea
            name="description"
            placeholder="Tell us about your product..."
            data={dataHandler}
          />
          <Input
            type="text"
            name="price"
            placeholder="How much does it cost?"
            data={dataHandler}
          />
        </div>
      )}
    </Form>
  );
};

export default AddProduct;
