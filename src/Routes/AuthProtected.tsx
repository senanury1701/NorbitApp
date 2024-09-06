import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { logoutUser } from "../slices/auth/login/thunk";

const AuthProtected = ({ children, allowedRoles = [] }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state: any) => state.login);

  const accessToken = sessionStorage.getItem('accessToken');
  const currentUser = user || (sessionStorage.getItem('authUser') ? JSON.parse(sessionStorage.getItem('authUser') || '{}') : null);

  useEffect(() => {
    if (currentUser && accessToken) {
      setAuthorization(accessToken);
    } else if (!currentUser && !loading && !accessToken) {
      dispatch(logoutUser() as any);
    }
  }, [accessToken, currentUser, loading, dispatch]);

  if (!currentUser && !loading && !accessToken) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length && !allowedRoles.includes(currentUser.role)) {
    // Redirect to an unauthorized page or another route if the user doesn't have permission
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default AuthProtected;
