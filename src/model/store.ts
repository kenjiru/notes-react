import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { mainReducer } from "./reducers";

export interface IStore {
    accessToken?: string;
    user?: IUser;
    manifest?: IManifest;
    notes?: INote[];
}

export interface IUser {
    displayName: string;
}

export interface INote {
    id: string;
    rev: number;
    title: string;
    lastChanged: string;
    content: string;
}

export interface IManifest {
    revision: string;
    serverId: string;
    notes: IManifestNote[];
}

export interface IManifestNote {
    id: string;
    rev: number;
}

const store: any = applyMiddleware(thunk)(createStore)(mainReducer);

export default store;