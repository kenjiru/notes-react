import * as moment from "moment";
import * as Dropbox from "dropbox";
import * as storage from "store";

import {IStore, INote} from "./store";
import {IAction, IActionCallback, IDispatchFunction, IGetStateFunction, createAction} from "../utils/ActionUtil";
import DropboxUtil from "../utils/DropboxUtil";
import SyncUtil from "../utils/SyncUtil";
import {ISyncData} from "../utils/DropboxUtil";
import NoteUtil from "../utils/NoteUtil";

export const CLIENT_ID: string = "17zzlf216nsykj9";

export const DROPBOX_SET_ACCESS_TOKEN: string = "DROPBOX_SET_ACCESS_TOKEN_SET_USER_INFO";
export function setAccessToken(accessToken: string): IAction {
    console.log("setAccessToken", accessToken);

    return createAction(DROPBOX_SET_ACCESS_TOKEN, accessToken);
}

export const DROPBOX_SET_CURRENT_ACCOUNT: string = "DROPBOX_SET_CURRENT_ACCOUNT";
export function getCurrentAccount(): IActionCallback {
    return (dispatch: IDispatchFunction, getState: IGetStateFunction): Promise<any> => {
        let dropbox: any = new Dropbox({
            clientId: CLIENT_ID,
            accessToken: getState().dropbox.accessToken
        });

        return dropbox.usersGetCurrentAccount().then((result) => {
            console.log("usersGetAccount", result);

            dispatch(createAction(DROPBOX_SET_CURRENT_ACCOUNT, {
                displayName: result.name.display_name
            }));
        });
    };
}

export function revokeAccess(): IActionCallback {
    return (dispatch: IDispatchFunction, getState: IGetStateFunction): Promise<any> => {
        let dropbox: any = new Dropbox({
            clientId: CLIENT_ID,
            accessToken: getState().dropbox.accessToken
        });

        return dropbox.authTokenRevoke().then((result) => {
            console.log("authTokenRevoke");

            dispatch(createAction(DROPBOX_SET_ACCESS_TOKEN, null));
            dispatch(createAction(DROPBOX_SET_CURRENT_ACCOUNT, null))
        });
    };
}

let numSyncRetries: number = 0;
const NUM_RETRIES: number = 4;

export function startSync(): IActionCallback {
    return (dispatch: IDispatchFunction, getState: IGetStateFunction): Promise<any> => {
        let dropboxUtil: DropboxUtil = new DropboxUtil(CLIENT_ID, getState().dropbox.accessToken);

        return dropboxUtil.hasLock().then((lockExists: boolean) => {
            if (lockExists) {
                if (numSyncRetries < NUM_RETRIES) {
                    ++numSyncRetries;
                    return new Promise((resolve) => {
                        setTimeout(() => resolve(dispatch(startSync())), 2000);
                    })
                } else {
                    console.log(`hasLock: I gave up after ${NUM_RETRIES} tries`);
                    numSyncRetries = 0;
                }
            } else {
                numSyncRetries = 0;
                return dispatch(syncNotes());
            }
        });
    }
}

export const DROPBOX_SET_LAST_SYNC: string = "DROPBOX_SET_LAST_SYNC";
export const SET_NOTES: string = "SET_NOTES";
function syncNotes(): IActionCallback {
    return (dispatch: IDispatchFunction, getState: IGetStateFunction): Promise<any> => {
        let state: IStore = getState();
        let dropboxUtil: DropboxUtil = new DropboxUtil(CLIENT_ID, state.dropbox.accessToken);

        return dropboxUtil.getSyncData(state.dropbox.lastSyncRevision).then((syncData: ISyncData) => {
            let syncResult = SyncUtil.syncNotes(state.local.notes, syncData.remoteNotes, syncData.baseManifest,
                state.dropbox.lastSyncDate);

            console.log("syncResult", syncResult);

            let latestRevision: number = syncData.remoteRevision;

            if (syncResult.isModifiedLocally) {
                latestRevision += 1;
            }

            let promises: Promise<any>[] = [];

            if (syncResult.idModifiedRemotely) {
                promises.push.apply(promises, [
                    dispatch(createAction(SET_NOTES, syncResult.notes))
                ]);
            }

            if (syncResult.isModifiedLocally || syncResult.idModifiedRemotely) {
                promises.push(
                    dispatch(createAction(DROPBOX_SET_LAST_SYNC, {
                        lastSyncDate: moment().format(),
                        lastSyncRevision: latestRevision
                    })),
                    dispatch(persistState())
                );
            }

            if (syncResult.isModifiedLocally) {
                return dropboxUtil.saveNewRevision(syncResult.notes, latestRevision, syncData.baseManifest.serverId)
                    .then(() => {
                        Promise.all(promises)
                    });
            }

            return Promise.all(promises);
        });
    };
}

export const CREATE_NEW_NOTE: string = "CREATE_NEW_NOTE";
export function createNewNote(noteId: string): IActionCallback {
    return (dispatch: IDispatchFunction): Promise<any> => {
        let newNote: INote = NoteUtil.createNewNote(noteId);

        dispatch(createAction(CREATE_NEW_NOTE, newNote));

        return dispatch(persistState());
    };
}

export const DELETE_NOTES: string = "DELETE_NOTES";
export function deleteNotes(notes: INote[]): IActionCallback {
    return (dispatch: IDispatchFunction): Promise<any> => {
        console.log("deleteNotes");
        dispatch(createAction(DELETE_NOTES, notes));

        return dispatch(persistState());
    };
}

export const UPDATE_NOTE: string = "UPDATE_NOTE";
export function updateNote(note: INote): IActionCallback {
    return (dispatch: IDispatchFunction): Promise<any> => {
        console.log("updateNote", note);
        dispatch(createAction(UPDATE_NOTE, note));

        return dispatch(persistState());
    };
}

export const RESTORE_STATE: string = "RESTORE_STATE";
export function restoreState(): IAction {
    let newState: IStore = storage.get("store");

    console.log("restoreState", newState);
    return createAction(RESTORE_STATE, newState);
}

export const PERSIST_STATE: string = "PERSIST_STATE";
export function persistState(): IActionCallback {
    return (dispatch: IDispatchFunction, getState: IGetStateFunction): Promise<any> => {
        storage.set("store", getState());

        console.log("persistState", getState());
        return dispatch(createAction(PERSIST_STATE));
    };
}
