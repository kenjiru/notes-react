import * as _ from "lodash";
import {IStore} from "./store";
import {IAction, DROPBOX_SET_USER_INFO} from "./actions";

let defaultStore: IStore = {
};

export function mainReducer(store: IStore = defaultStore, action: IAction): IStore {
    switch (action.type) {
        case DROPBOX_SET_USER_INFO:
            return _.merge({}, store, {
                user: action.payload
            });
    }

    return store;
}
