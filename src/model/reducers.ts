import * as _ from "lodash";
import {INote, ILocal, IDropbox, IUi} from "./store";
import {
    DROPBOX_SET_CURRENT_ACCOUNT, DROPBOX_SET_ACCESS_TOKEN, DROPBOX_SET_LAST_SYNC,
    RESTORE_STATE, SET_NOTES, CREATE_NEW_NOTE, UPDATE_NOTE, DELETE_NOTES, SET_FOLDERS, CREATE_NEW_FOLDER,
    SET_SELECTED_NOTES, SELECT_FOLDER, CONFIRM_DELETION,
    SHOW_SNACKBAR_MESSAGE, CONFIRMATION_DELETION, SHOW_CREATE_FOLDER_DIALOG, SHOW_MOVE_NOTES_DIALOG
} from "./actions";
import {IAction} from "../utils/ActionUtil";
import {combineReducers} from "redux";

function dropbox(store: IDropbox = {}, action: IAction): IDropbox {
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

let defaultLocal: ILocal = {
    notes: []
};

function local(store: ILocal = defaultLocal, action: IAction): ILocal {
    let notes: INote[];

    switch (action.type) {
        case SET_FOLDERS:
            return _.assign({}, store, {
                folders: action.payload
            });

        case CREATE_NEW_FOLDER:
            let folders: string[] = _.clone(store.folders);
            folders.push(action.payload as string);

            return _.assign({}, store, {
                folders
            });

        case SET_NOTES:
            return _.assign({}, store, {
                notes: action.payload
            });

        case CREATE_NEW_NOTE:
            let newNote: INote = action.payload as INote;

            notes = _.clone(store.notes);
            notes.push(newNote);

            return _.assign({}, store, {
                notes
            });

        case DELETE_NOTES:
            let notesToDelete: INote[] = action.payload as INote[];

            notes = _.clone(store.notes);
            notes = _.filter(notes, (note: INote): boolean =>
                _.findIndex(notesToDelete, note) === -1
            );

            return _.assign({}, store, {
                notes
            });

        case UPDATE_NOTE:
            notes = _.clone(store.notes);
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

let defaultUi: IUi = {
    snackbar: {
        message: ""
    },
    selectedNotes: []
};

function ui(store: IUi = defaultUi, action: IAction): IUi {
    switch (action.type) {
        case SET_SELECTED_NOTES:
            return _.assign({}, store, {
                selectedNotes: action.payload
            });

        case SHOW_MOVE_NOTES_DIALOG:
            return _.assign({}, store, {
                showMoveNotesDialog: {}
            });

        case SHOW_CREATE_FOLDER_DIALOG:
            console.log("SHOW_CREATE_FOLDER_DIALOG");
            return _.assign({}, store, {
                showCreateFolderDialog: {}
            });

        case SHOW_SNACKBAR_MESSAGE:
            return _.assign({}, store, {
                snackbar: {
                    message: action.payload
                }
            });

        case CONFIRMATION_DELETION:
            return _.assign({}, store, {
                notesToDelete: action.payload
            });

        case CONFIRM_DELETION:
            return _.assign({}, store, {
                deleteConfirmationId: action.payload
            });

        case SELECT_FOLDER:
            return _.assign({}, store, {
                selectedFolder: action.payload
            });
    }

    return store;
}

export default combineReducers({local, dropbox, ui});
