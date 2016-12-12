import * as _ from "lodash";

import {IDropbox} from "../store";
import {
    DROPBOX_SET_CURRENT_ACCOUNT, DROPBOX_SET_ACCESS_TOKEN, DROPBOX_SET_LAST_SYNC
} from "../actions/dropbox";
import {RESTORE_STATE} from "../actions/local";

import {IAction} from "../../utils/ActionUtil";
import DropboxUtil from "../../utils/DropboxUtil";

let defaultDropbox: IDropbox = {
    lastSyncRevision: DropboxUtil.NEVER_SYNCED_REVISION
};

export function dropbox(store: IDropbox = defaultDropbox, action: IAction): IDropbox {
    switch (action.type) {
        case DROPBOX_SET_ACCESS_TOKEN:
            return _.assign({}, store, {
                accessToken: action.payload
            });

        case DROPBOX_SET_CURRENT_ACCOUNT:
            return _.assign({}, store, {
                user: action.payload
            });

        case DROPBOX_SET_LAST_SYNC:
            return _.assign({}, store, {
                lastSyncDate: action.payload.lastSyncDate,
                lastSyncRevision: action.payload.lastSyncRevision,
            });

        case RESTORE_STATE:
            if (_.isNil(action.payload)) {
                return store;
            }

            return action.payload.dropbox;
    }

    return store;
}
