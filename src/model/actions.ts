import * as moment from "moment";
import * as Dropbox from "dropbox";
import * as storage from "store";

import {IStore, IManifest, INote} from "./store";
import {IAction, IActionCallback, IDispatchFunction, IGetStateFunction, createAction} from "../utils/ActionUtil";
import DropboxUtil from "../utils/DropboxUtil";
import SyncUtil from "../utils/SyncUtil";

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

        return dropboxUtil.setLock().then(() => {
            return Promise.all([
                dropboxUtil.readManifest(),
                dropboxUtil.readManifestFor(state.dropbox.lastSyncRevision || 0)
            ]).then(([manifest, baseManifest]: IManifest[]) => {
                console.log("readManifest", manifest);

                return dropboxUtil.readNotes(manifest).then((notes: INote[]) => {
                    console.log("readNotes", notes);

                    let syncResult: INote[] = SyncUtil.syncNotes(state.local.notes, notes, baseManifest,
                        state.dropbox.lastSyncDate);
                    console.log("syncState", syncResult);

                    return Promise.all([
                        dispatch(createAction(DROPBOX_SET_LAST_SYNC, {
                            lastSyncDate: moment().format(),
                            lastSyncRevision: manifest.revision
                        })),
                        dispatch(createAction(SET_NOTES, syncResult)),
                        dispatch(persistState())
                    ]);
                });
            }).then(() => dropboxUtil.removeLock(), () => dropboxUtil.removeLock());
        });
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
