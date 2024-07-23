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

});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

