import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { logoutUser } from "../slices/auth/login/thunk";

const AuthProtected = (props:any) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state:any) => state.login);

  // sessionStorage'dan kullanıcı bilgilerini al
  const userItem = sessionStorage.getItem('authUser');
  const accessToken = sessionStorage.getItem('accessToken');
  const user = userItem ? JSON.parse(userItem) : null;

  useEffect(() => {
    if (user && accessToken) {
      setAuthorization(accessToken);
    } else if (!user && !loading && !accessToken) {
      dispatch(logoutUser() as any);    }
  }, [accessToken, user, loading, dispatch]);



  if (!user && !loading && !accessToken) {
    return <Navigate to="/login" />;
  }

  return <>{props.children}</>;
};

export default AuthProtected;
