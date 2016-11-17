import * as _ from "lodash";
import * as moment from "moment";
import * as Dropbox from "dropbox";
import * as storage from "store";

import {IStore, INote} from "./store";
import {IAction, IActionCallback, IDispatchFunction, IGetStateFunction, createAction} from "../utils/ActionUtil";
import DropboxUtil from "../utils/DropboxUtil";
import SyncUtil from "../utils/SyncUtil";
import {ISyncData} from "../utils/DropboxUtil";
import NoteUtil from "../utils/NoteUtil";
import IdUtil from "../utils/IdUtil";
import FolderUtil from "../utils/FolderUtil";

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
export const SET_FOLDERS: string = "SET_FOLDERS";
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
    return (dispatch: IDispatchFunction, getState: IGetStateFunction): Promise<any> => {
        let folder: string = getState().ui.selectedFolder;
        let newNote: INote = NoteUtil.createNewNote(noteId, folder);

        dispatch(createAction(CREATE_NEW_NOTE, newNote));

        return dispatch(persistState());
    };
}

export const DELETE_NOTES: string = "DELETE_NOTES";
export const CONFIRM_DELETION: string = "CONFIRM_DELETION";
export function deleteNotes(notes: INote[]): IActionCallback {
    return (dispatch: IDispatchFunction): Promise<any> => {
        console.log("deleteNotes");
        dispatch(createAction(DELETE_NOTES, notes));
        dispatch(createAction(CONFIRM_DELETION, IdUtil.getNodeListId(notes)));

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

export const UPDATE_ALL_NOTES: string = "UPDATE_ALL_NOTES";
export function moveNotesTo(notes: INote[], folder: string): IActionCallback {
    return (dispatch: IDispatchFunction): Promise<any> => {
        let notesToMove: INote[] = _.clone(notes);
        _.each(notesToMove, (note: INote): void => FolderUtil.setFolder(note, folder));

        dispatch(createAction(UPDATE_ALL_NOTES, notesToMove));
        return dispatch(persistState());
    };
}

export const CREATE_NEW_FOLDER: string = "CREATE_NEW_FOLDER";
export function createFolder(folderName: string): IActionCallback {
    return (dispatch: IDispatchFunction): Promise<any> => {
        let folderTemplate: INote = NoteUtil.createTemplateNote(folderName);

        dispatch(createAction(CREATE_NEW_FOLDER, folderName));
        return dispatch(createAction(CREATE_NEW_NOTE, folderTemplate));
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

export const SET_SELECTED_NOTES: string = "SET_SELECTED_NOTES";
export function setSelectedNotes(notes: INote[]): IAction {
    return createAction(SET_SELECTED_NOTES, notes);
}

export const SHOW_MOVE_NOTES_DIALOG: string = "SHOW_MOVE_NOTES_DIALOG";
export function showMoveNotesDialog(): IAction {
    return createAction(SHOW_MOVE_NOTES_DIALOG);
}

export const SHOW_CREATE_FOLDER_DIALOG: string = "SHOW_CREATE_FOLDER_DIALOG";
export function showCreateFolderDialog(): IAction {
    return createAction(SHOW_CREATE_FOLDER_DIALOG);
}

export const SHOW_ABOUT_DIALOG: string = "SHOW_ABOUT_DIALOG";
export function showAboutDialog(): IAction {
    return createAction(SHOW_ABOUT_DIALOG);
}

export const SHOW_SNACKBAR_MESSAGE: string = "SHOW_SNACKBAR_MESSAGE";
export function showSnackbarMessage(message: string): IAction {
    return createAction(SHOW_SNACKBAR_MESSAGE, message);
}

export const CONFIRMATION_DELETION: string = "CONFIRMATION_DELETION";
export function confirmDeletion(noteToDelete): IAction {
    return createAction(CONFIRMATION_DELETION, noteToDelete);
}

export const SELECT_FOLDER: string = "SELECT_FOLDER";
export function selectFolder(folder): IAction {
    return createAction(SELECT_FOLDER, folder);
}
