import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import mainReducer from "./reducers";

export interface IStore {
    local: ILocal;
    dropbox: IDropbox;
}

export interface ILocal {
    notes?: INote[];
}

export interface IDropbox {
    lastSyncDate?: string;
    lastSyncRevision?: number;
    accessToken?: string;
    user?: IUser;
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
    revision: number;
    serverId: string;
    notes: IManifestNote[];
}

export interface IManifestNote {
    id: string;
    rev: number;
}

export interface ILock {
    transactionId: string;
    clientId: string;
    renewCount: number;
    lockExpirationDuration: string;
    revision: number;
}

const store: any = applyMiddleware(thunk)(createStore)(mainReducer);

export default store;