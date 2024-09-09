import React from "react";
import { Navigate } from "react-router-dom";

//Pages
import DashboardEcommerce from "../pages/DashboardEcommerce/index";
import UserProfile from "../pages/Authentication/user-profile";
import EmployeeManangement from '../pages/EmployeeManagement/index'
import Permissions from '../pages/Permissions/index'
import AccountInformation from '../pages/AccountInformation/index'
import Company from '../pages/Company/index'
import Jobs from '../pages/Jobs/index'
import Inventories from '../pages/Inventories/index'
import Purchases from '../pages/Purchases/index'
import Category from '../pages/Category/index'
import Project from '../pages/Project/index'
import DataSheet from '../pages/DataSheet/index'
import Knowhow from '../pages/Knowhow/index'
import Drive from '../pages/Drive/index'
import Cloud from '../pages/Cloud/index'
import File from '../pages/File/index'
import PurchaseRequest from '../pages/PurchaseRequest/index'

//AuthenticationInner pages
import Basic404 from '../pages/AuthenticationInner/Errors/Basic404';
import Cover404 from '../pages/AuthenticationInner/Errors/Cover404';
import Alt404 from '../pages/AuthenticationInner/Errors/Alt404';
import Error500 from '../pages/AuthenticationInner/Errors/Error500';
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";



//login
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";

const UnauthorizedPage = () => {
  return (
    <div>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
    </div>
  );
};


const authProtectedRoutes = [
  { path: "/dashboard", component: <DashboardEcommerce /> },
  { path: "/permissions", component: <Permissions />,  },
  { path: "/accountInformation", component: <AccountInformation /> },
  { path: "/company", component: <Company /> },
  { path: "/jobs", component: <Jobs /> },
  { path: "/inventories", component: <Inventories /> },
  { path: "/purchases", component: <Purchases /> },
  { path: "/category", component: <Category /> },
  { path: "/project", component: <Project /> },
  { path: "/dataSheet", component: <DataSheet /> },
  { path: "/knowhow", component: <Knowhow /> },
  { path: "/profile", component: <UserProfile /> },
  { path: "/employeeManangement", component: <EmployeeManangement />,  },
  { path: "/cloud", component: <Cloud />,  },
  { path: "/drive", component: <Drive />, },
  { path: "/file", component: <File />,  },
  { path: "/purchase-request", component: <PurchaseRequest /> },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "*", component: <Navigate to="/login" /> },
];


const publicRoutes : any= [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/unauthorized", component: <UnauthorizedPage /> },



  //AuthenticationInner pages

  { path: "/auth-404-basic", component: <Basic404 /> },
  { path: "/auth-404-cover", component: <Cover404 /> },
  { path: "/auth-404-alt", component: <Alt404 /> },
  { path: "/auth-500", component: <Error500 /> },

  { path: "/auth-offline", component: <Offlinepage /> },

];

export { authProtectedRoutes, publicRoutes };