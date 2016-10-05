import {IUser} from "./store";

export interface IAction {
    type: string;
    payload?: Error|any;
    error?: boolean;
    meta?: any;
}

export const DROPBOX_SET_USER_INFO: string = "DROPBOX_SET_USER_INFO";
export function setUserInfo(userInfo: IUser): IAction {
    return {
        type: DROPBOX_SET_USER_INFO,
        payload: userInfo
    };
}
