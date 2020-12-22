import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";

import NavBar from "./shared/UI Elements/Navigation/NavBar/NavBar";
import Footer from "./shared/UI Elements/Footer/Footer";
import ScrollTop from "./shared/utils/ScrollTop/ScrollTop";
import Spinner from "./shared/UI Elements/Spinner/Spinner";
import AlertMessage from "./shared/UI Elements/AlertMessage/AlertMessage";
import { AuthContext } from "./shared/utils/context/authContext";
import { useAuth } from "./shared/hooks/auth-hook";

const Products = lazy(() => import("./products/pages/Products/Products"));
const HomePage = lazy(() => import("./shared/pages/HomePage/HomePage"));
const UserProducts = lazy(() =>
  import("./products/pages/UserProducts/UserProducts")
);
const Product = lazy(() => import("./products/pages/Product/Product"));
const AddProduct = lazy(() => import("./products/pages/AddProduct/AddProduct"));
const EditProduct = lazy(() =>
  import("./products/pages/EditProduct/EditProduct")
);
const Signup = lazy(() => import("./users/pages/Signup/Signup"));
const Login = lazy(() => import("./users/pages/Login/Login"));
const Cart = lazy(() => import("./users/pages/Cart/Cart"));
const Checkout = lazy(() => import("./users/pages/Checkout/Checkout"));
const Orders = lazy(() => import("./users/pages/Orders/Orders"));

const App = () => {
  const { token, userId, login, logout, username } = useAuth();
  let location = useLocation().pathname;
  let localStorageToken;
  if (localStorage.getItem("userData")) {
    localStorageToken = JSON.parse(localStorage.getItem("userData")).token;
  }

  let routes;

  if (token || localStorageToken) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/products" exact>
          <AlertMessage />
          <Products />
        </Route>
        <Route path="/products/:prodId" exact>
          <AlertMessage />
          <Product />
        </Route>
        <Route path="/products/user/:userId" exact>
          <UserProducts />
        </Route>
        <Route path="/add-product" exact>
          <AddProduct />
        </Route>
        <Route path="/edit-product/:prodId" exact>
          <EditProduct />
        </Route>
        <Route path="/cart" exact>
          <Cart />
        </Route>
        <Route path="/checkout" exact>
          <Checkout />
        </Route>
        <Route path="/orders" exact>
          <Orders />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/products" exact>
          <Products />
        </Route>
        <Route path="/products/:prodId" exact>
          <Product />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        token: token,
        isLoggedIn: !!token,
        userId: userId,
        login: login,
        logout: logout,
        username: username
      }}
    >
      <NavBar />
      <ScrollTop location={location && location}>
        <main>
          <Suspense fallback={<Spinner overlay />}>{routes}</Suspense>
        </main>
        <Footer />
      </ScrollTop>
    </AuthContext.Provider>
  );
};

export default App;
