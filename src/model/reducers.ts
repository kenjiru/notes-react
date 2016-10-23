import * as _ from "lodash";
import {IStore, INote, ILocal, IDropbox} from "./store";
import {
    DROPBOX_SET_CURRENT_ACCOUNT, DROPBOX_SET_ACCESS_TOKEN,
    DROPBOX_SET_NOTES, RESTORE_STATE, UPDATE_NOTE, DROPBOX_SET_LAST_SYNCED, SET_NOTES
} from "./actions";
import {IAction} from "../utils/ActionUtil";
import {combineReducers} from "redux";

let defaultDropbox: IDropbox = {
    notes: []
};

function dropbox(store: IDropbox = defaultDropbox, action: IAction): IDropbox {
    switch (action.type) {
        case DROPBOX_SET_ACCESS_TOKEN:
            return _.assign({}, store, {
                accessToken: action.payload
            });

        case DROPBOX_SET_CURRENT_ACCOUNT:
            return _.assign({}, store, {
                user: action.payload
            });

        case DROPBOX_SET_NOTES:
            return _.assign({}, store, {
                notes: action.payload
            });

        case DROPBOX_SET_LAST_SYNCED:
            return _.assign({}, store, {
                lastSynced: action.payload
            });

        case RESTORE_STATE:
            if (_.isNil(action.payload)) {
                return store;
            }

            return action.payload.dropbox;
    }

    return store;
}

let defaultLocal: IDropbox = {
    notes: []
};

function local(store: ILocal = defaultLocal, action: IAction): ILocal {
    switch (action.type) {
        case SET_NOTES:
            return _.assign({}, store, {
                notes: action.payload
            });

        case UPDATE_NOTE:
            let notes: INote[] = _.clone(store.notes);
            let updatedNoteIndex: number = _.findIndex(notes, {id: action.payload.id});

            notes[updatedNoteIndex] = _.assign(notes[updatedNoteIndex], action.payload);

            return _.assign({}, store, {
                notes
            });

        case RESTORE_STATE:
            if (_.isNil(action.payload)) {
                return store;
            }

            return action.payload.local;
    }

    return store;
}

export default combineReducers({local, dropbox});
