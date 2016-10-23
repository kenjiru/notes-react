import * as _ from "lodash";
import {IStore, INote} from "./store";
import {
    DROPBOX_SET_CURRENT_ACCOUNT, DROPBOX_SET_ACCESS_TOKEN,
    DROPBOX_SET_NOTES, RESTORE_STATE, UPDATE_NOTE
} from "./actions";
import {IAction} from "../utils/ActionUtil";

let defaultStore: IStore = {
    notes: []
};

// FIXME Investigate what's the best approach for setting the state
export function mainReducer(store: IStore = defaultStore, action: IAction): IStore {
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

        case UPDATE_NOTE:
            let notes: INote[] = _.clone(store.notes);
            let updatedNoteIndex: number = _.findIndex(notes, {id: action.payload.id});

            notes[updatedNoteIndex] = _.assign(notes[updatedNoteIndex], action.payload);

            return _.assign({}, store, {
                notes
            });

        case RESTORE_STATE:
            return action.payload;
    }

    return store;
}
