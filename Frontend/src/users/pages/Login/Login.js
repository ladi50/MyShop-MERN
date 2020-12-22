import React, { useContext } from "react";

import Form from "../../../shared/Form/FormLayout/FormLayout";
import Input from "../../../shared/Form/Input/Input";
import Spinner from "../../../shared/UI Elements/Spinner/Spinner";
import { useFetch } from "../../../shared/hooks/fetch-hook";
import { AuthContext } from "../../../shared/utils/context/authContext";
import { useError } from "../../../shared/hooks/error-hook";
import { useData } from "../../../shared/hooks/data-hook";

const Login = () => {
  const { login } = useContext(AuthContext);
  const { fetchHandler, error, isLoading } = useFetch();
  const { errorHandler } = useError();
  const { dataHandler, inputsData } = useData();

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const resData = await fetchHandler(
        `${process.env.REACT_APP_BACKEND_URL}/users/login`,
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
        console.log("Logged in successfully!");
      }
    } catch (err) {
      throw new Error("Log in failed!");
    }
  };

  return (
    <Form onSubmit={loginHandler} formTitle="Log In" buttonName="Log In">
      {isLoading && <Spinner />}
      {error && errorHandler(error)}
      {!isLoading && (
        <div>
          <div className="form__input-div">
            <label className="form-label">Email</label>
            <Input
              data={dataHandler}
              type="email"
              placeholder="Enter your email"
              name="email"
              focus
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

export default Login;
