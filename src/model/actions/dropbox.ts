import * as moment from "moment";
import * as Dropbox from "dropbox";

import {IStore} from "../store";
import {IAction, IActionCallback, IDispatchFunction, IGetStateFunction, createAction} from "../../utils/ActionUtil";
import DropboxUtil from "../../utils/DropboxUtil";
import SyncUtil from "../../utils/SyncUtil";
import {ISyncData} from "../../utils/DropboxUtil";

import {persistState, SET_NOTES, SET_FOLDERS} from "./local";

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

        let resetAuth: Function = (): void => {
            console.log("revokeAccess reset authentication credentials");
            dispatch(createAction(DROPBOX_SET_ACCESS_TOKEN, null));
            dispatch(createAction(DROPBOX_SET_CURRENT_ACCOUNT, null))
        };

        return dropbox.authTokenRevoke().then(resetAuth, (error: Error): void => {
            console.log("revokeAccess error", error);
            resetAuth();
        });
    };
}

let numSyncRetries: number = 0;
const NUM_RETRIES: number = 4;
const LOCK_WAIT_TIME: number = 2000;
export function startSync(): IActionCallback {
    return (dispatch: IDispatchFunction, getState: IGetStateFunction): Promise<any> => {
        let dropboxUtil: DropboxUtil = new DropboxUtil(CLIENT_ID, getState().dropbox.accessToken);

        return dropboxUtil.hasLock().then((lockExists: boolean) => {
            if (lockExists) {
                if (numSyncRetries < NUM_RETRIES) {
                    ++numSyncRetries;

                    return new Promise((resolve) => {
                        setTimeout(() => resolve(dispatch(startSync())), LOCK_WAIT_TIME);
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
function syncNotes(): IActionCallback {
    return (dispatch: IDispatchFunction, getState: IGetStateFunction): Promise<any> => {
        let state: IStore = getState();
        let dropboxUtil: DropboxUtil = new DropboxUtil(CLIENT_ID, state.dropbox.accessToken);

        return dropboxUtil.getSyncData(state.dropbox.lastSyncRevision).then((syncData: ISyncData) => {
            let syncResult = SyncUtil.syncNotes(state.local.notes, syncData.remoteNotes, syncData.baseManifest,
                state.dropbox.lastSyncDate, state.dropbox.lastSyncRevision);

            console.log("syncResult", syncResult);

            let latestRevision: number = syncData.remoteRevision;

            if (syncResult.isModifiedLocally) {
                latestRevision += 1;
            }

            let promises: Promise<any>[] = [];

            if (syncResult.idModifiedRemotely) {
                promises.push.apply(promises, [
                    dispatch(createAction(SET_NOTES, syncResult.notes)),
                    dispatch(createAction(SET_FOLDERS, syncResult.folders)),
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
                    .then((sessionFinishBatchArg: any): void => {
                        console.log({sessionFinishBatchArg});
                    });
            }

            return Promise.all(promises);
        });
    };
}
