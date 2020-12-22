import { useEffect, useCallback, useState } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();
  const [username, setUsername] = useState();
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((uId, uName, jwtToken, expirationDate) => {
    setUserId(uId);
    setToken(jwtToken);
    setUsername(uName);

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 60 * 60 * 1000);

    setTokenExpirationDate(tokenExpirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uId,
        username: uName,
        token: jwtToken,
        expiration: expirationDate || tokenExpirationDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setTokenExpirationDate(null);
    setToken(null);
    setUserId(null);
    setUsername(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (
      userData &&
      userData.token &&
      new Date(userData.expiration) > new Date()
    ) {
      login(userData.userId, userData.username, userData.token, new Date(userData.expiration));
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();

      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, tokenExpirationDate, logout]);

  return { token, userId, login, logout, username };
};
