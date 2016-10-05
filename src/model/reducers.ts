import * as _ from "lodash";
import {IStore} from "./store";
import {DROPBOX_SET_CURRENT_ACCOUNT, DROPBOX_SET_ACCESS_TOKEN} from "./actions";
import {IAction} from "../utils/ActionUtil";

let defaultStore: IStore = {
};

export function mainReducer(store: IStore = defaultStore, action: IAction): IStore {
    switch (action.type) {
        case DROPBOX_SET_ACCESS_TOKEN:
            return _.merge({}, store, {
                accessToken: action.payload
            });

        case DROPBOX_SET_CURRENT_ACCOUNT:
            return _.merge({}, store, {
                user: action.payload
            });
    }

    return store;
}
