import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ProfileReducer from "./auth/profile/reducer";
import companyReducer from "./company/reducers";
import datasheetReducer from "./datasheet/reducers";
import categoryReducer from "./category/reducers";
import jobsReducer from "./jobs/reducers";
import inventoriesReducer from "./inventory/reducers";
import employeeManangementReducer from "./employeeManangement/reducers";
import projectReducer from "./project/reducers";
import accountInformationReducer from "./accountInformation/reducers";
import permissionReducer from "./permission/reducers";


const rootReducer = combineReducers({
    Layout: LayoutReducer,
    Login: LoginReducer,
    Account: AccountReducer,
    ForgetPassword: ForgetPasswordReducer,
    Profile: ProfileReducer,
    company: companyReducer,
    datasheet: datasheetReducer,
    category: categoryReducer,
    jobs: jobsReducer,
    inventories: inventoriesReducer,
    employeeManangement: employeeManangementReducer,
    project: projectReducer,
    accountInformation: accountInformationReducer,
    permission: permissionReducer,

});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

