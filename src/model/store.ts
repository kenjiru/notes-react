import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { mainReducer } from "./reducers";

export interface IStore {
    accessToken?: string;
    user?: IUser;
}

export interface IUser {
    displayName: string;
}

const store: any = applyMiddleware(thunk)(createStore)(mainReducer);

export default store;