import * as _ from "lodash";
import {IStore} from "./store";
import {
    DROPBOX_SET_CURRENT_ACCOUNT, DROPBOX_SET_ACCESS_TOKEN, DROPBOX_SET_MANIFEST,
    DROPBOX_SET_NOTES
} from "./actions";
import {IAction} from "../utils/ActionUtil";

let defaultStore: IStore = {
};

// FIXME Investigate what's the best approach for setting the state
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

        case DROPBOX_SET_MANIFEST:
            return _.merge(store, {
                manifest: action.payload
            });

        case DROPBOX_SET_NOTES:
            return _.merge(store, {
                notes: action.payload
            });
    }

    return store;
}
