import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { mainReducer } from "./reducers";

export interface IStore {
    user?: IUser;
}

export interface IUser {
    accessToken: string;
    displayName: string;
}

const store: any = applyMiddleware(thunk)(createStore)(mainReducer);

export default store;