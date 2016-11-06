import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import mainReducer from "./reducers";

export interface IStore {
    local: ILocal;
    dropbox: IDropbox;
    ui: IUi;
}

export interface IUi {
    snackbar?: ISnackbar;
    notesToDelete?: INote[];
    deleteConfirmationId?: string;
}

export interface ISnackbar {
    message: string;
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
    createDate: string;
    lastChanged: string;
    content: string;
    tags?: string[];
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