/* eslint-disable react-hooks/exhaustive-deps */
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../utils/firebase";
import { useState } from "react";
import { useEffect } from "react";

export default function PrivateRoutes() {
  const [authUser, setAuthUser] = useState();
  const [loginState, setLoginState] = useState(false);

  //const user = auth.currentUser;

  const user = true;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = () => {
      var isAuth = localStorage.getItem("isAuth");
      if (isAuth) {
        console.log("User Logged In!");
        setLoginState(true);
        navigate("/admin");
      } else if (user) {
        console.log("User exists >>", user);
        setAuthUser(user);
        navigate("/admin");
      }
    };

    fetchUser();
  }, []);

  return loginState ? (
    <Outlet />
  ) : authUser ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
