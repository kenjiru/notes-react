import * as _ from "lodash";

import {INote, ILocal} from "../store";
import {
    RESTORE_STATE, CREATE_NEW_NOTE, UPDATE_NOTE, UPDATE_ALL_NOTES, DELETE_NOTES, SET_NOTES,
    CREATE_NEW_FOLDER, RENAME_FOLDER, DELETE_FOLDER, SET_FOLDERS
} from "../actions/local";
import {IAction} from "../../utils/ActionUtil";

let defaultLocal: ILocal = {
    notes: []
};

export function local(store: ILocal = defaultLocal, action: IAction): ILocal {
    let notes: INote[];
    let folders: string[];
    let index: number;

    switch (action.type) {
        case SET_FOLDERS:
            return _.assign({}, store, {
                folders: action.payload
            });

        case CREATE_NEW_FOLDER:
            folders = _.clone(store.folders);
            folders.push(action.payload as string);

            return _.assign({}, store, {
                folders
            });

        case RENAME_FOLDER:
            folders = _.clone(store.folders);
            index = _.findIndex(folders, (folder: string): boolean => folder === action.payload.oldName);

            folders[index] = action.payload.newName;

            return _.assign({}, store, {
                folders
            });

        case DELETE_FOLDER:
            folders = _.clone(store.folders);
            index = _.findIndex(folders, (folder: string): boolean => folder === action.payload);

            folders.splice(index, 1);

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

        case UPDATE_ALL_NOTES:
            let updatedNotes: INote[] = action.payload as INote[];

            return _.assign({}, store, {
                notes: _.unionBy(updatedNotes, store.notes, "id")
            });

        case RESTORE_STATE:
            if (_.isNil(action.payload)) {
                return store;
            }

            return action.payload.local;
    }

    return store;
}
