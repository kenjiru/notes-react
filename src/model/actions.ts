import * as Dropbox from "dropbox";

import {IManifest, INote} from "./store";
import {IAction, IActionCallback, IDispatchFunction, IGetStateFunction, createAction} from "../utils/ActionUtil";
import DropboxUtil from "../utils/DropboxUtil";

export const CLIENT_ID: string = "17zzlf216nsykj9";

export const DROPBOX_SET_ACCESS_TOKEN: string = "DROPBOX_SET_ACCESS_TOKEN_SET_USER_INFO";
export function setAccessToken(accessToken: string): IAction {
    return createAction(DROPBOX_SET_ACCESS_TOKEN, accessToken);
}

export const DROPBOX_SET_CURRENT_ACCOUNT: string = "DROPBOX_SET_CURRENT_ACCOUNT";
export function getCurrentAccount(): IActionCallback {
    return (dispatch: IDispatchFunction, getState: IGetStateFunction): Promise<any> => {
        let dropbox: any = new Dropbox({
            clientId: CLIENT_ID,
            accessToken: getState().accessToken
        });

        return dropbox.usersGetCurrentAccount().then((result) => {
            console.log("dropbox.usersGetAccount", result);

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
            accessToken: getState().accessToken
        });

        return dropbox.authTokenRevoke().then((result) => {
            console.log("authTokenRevoke");

            dispatch(createAction(DROPBOX_SET_ACCESS_TOKEN, null));
            dispatch(createAction(DROPBOX_SET_CURRENT_ACCOUNT, null))
        });
    };
}

export const DROPBOX_SET_MANIFEST: string = "DROPBOX_SET_MANIFEST";
export const DROPBOX_SET_NOTES: string = "DROPBOX_SET_NOTES";
export function loadNotes(): IActionCallback {
    return (dispatch: IDispatchFunction, getState: IGetStateFunction): Promise<any> => {
        let dropboxUtil: DropboxUtil = new DropboxUtil(CLIENT_ID, getState().accessToken);
        console.log("loadNotes", getState().accessToken);

        return dropboxUtil.readManifest().then((manifest: IManifest) => {
            console.log("readManifest", manifest);
            dispatch(createAction(DROPBOX_SET_MANIFEST, manifest));

            return dropboxUtil.readNotes(manifest).then((notes: INote[]) => {
                console.log("readNotes", notes);
                dispatch(createAction(DROPBOX_SET_NOTES, notes));
            });
        });
    }
}
