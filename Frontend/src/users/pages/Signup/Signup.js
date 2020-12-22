import React, { useContext } from "react";

import Form from "../../../shared/Form/FormLayout/FormLayout";
import Input from "../../../shared/Form/Input/Input";
import Spinner from "../../../shared/UI Elements/Spinner/Spinner";
import { AuthContext } from "../../../shared/utils/context/authContext";
import { useFetch } from "../../../shared/hooks/fetch-hook";
import { useError } from "../../../shared/hooks/error-hook";
import { useData } from "../../../shared/hooks/data-hook";

const Signup = () => {
  const { login } = useContext(AuthContext);
  const { fetchHandler, error, isLoading } = useFetch();
  const { errorHandler } = useError();
  const { dataHandler, inputsData } = useData();

  const signupHandler = async (e) => {
    e.preventDefault();

    try {
      const resData = await fetchHandler(
        `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(inputsData)
        }
      );

      if (resData) {
        login(resData.userId, resData.name, resData.token);
        // localStorage.setItem("username", resData.name);
        console.log("Signed up successfully!");
      }
    } catch (err) {
      throw new Error("Sign up failed!");
    }
  };

  return (
    <Form onSubmit={signupHandler} formTitle="Sign Up" buttonName="Sign Up">
      {isLoading && <Spinner overlay />}
      {error && errorHandler(error)}
      {!isLoading && (
        <div>
          <div className="form__input-div">
            <label className="form-label">Name</label>
            <Input
              data={dataHandler}
              type="text"
              placeholder="Enter your name"
              name="name"
              focus
            />
          </div>
          <div className="form__input-div">
            <label className="form-label">Email</label>
            <Input
              data={dataHandler}
              type="email"
              placeholder="Enter your email"
              name="email"
            />
          </div>
          <div className="form__input-div">
            <label className="form-label">Password</label>
            <Input
              data={dataHandler}
              type="password"
              placeholder="Enter your password"
              name="password"
            />
          </div>
        </div>
      )}
    </Form>
  );
};

export default Signup;
