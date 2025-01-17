import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
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
import knowhowReducer from "./knowhow/reducers";
import driveReducer from "./drive/reducers";
import fileReducer from "./file/reducers";
import cloudReducer from "./cloud/reducers";
import purchaseReducer from "./purchase/reducers";


const rootReducer = combineReducers({
    Layout: LayoutReducer,
    login: LoginReducer,
    Account: AccountReducer,
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
    knowhow: knowhowReducer,
    drive: driveReducer,
    file: fileReducer,
    cloud: cloudReducer,
    purchase: purchaseReducer,

});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

