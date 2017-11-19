import * as _ from "lodash";

import { IUi } from "../store";
import {
    SET_SELECTED_NOTES, SELECT_FOLDER, SHOW_SNACKBAR_MESSAGE, CONFIRMATION_DELETION, CONFIRM_DELETION,
    SHOW_CREATE_FOLDER_DIALOG, SHOW_DELETE_FOLDER_DIALOG, SHOW_MOVE_NOTES_DIALOG, SHOW_ABOUT_DIALOG
} from "../actions/ui";
import {IAction} from "../../utils/ActionUtil";
import FolderUtil from "../../utils/FolderUtil";
import {} from "../actions/local";

let defaultUi: IUi = {
    snackbar: {
        message: ""
    },
    selectedNotes: [],
    selectedFolder: FolderUtil.ALL_NOTES
};

export function ui(store: IUi = defaultUi, action: IAction): IUi {
    switch (action.type) {
        case SET_SELECTED_NOTES:
            return _.assign({}, store, {
                selectedNotes: action.payload
            });

        case SHOW_ABOUT_DIALOG:
            return _.assign({}, store, {
                showAboutDialog: {}
            });

        case SHOW_MOVE_NOTES_DIALOG:
            return _.assign({}, store, {
                showMoveNotesDialog: {}
            });

        case SHOW_CREATE_FOLDER_DIALOG:
            return _.assign({}, store, {
                showCreateFolderDialog: {}
            });

        case SHOW_DELETE_FOLDER_DIALOG:
            return _.assign({}, store, {
                showDeleteFolderDialog: {},
                folderToDelete: action.payload
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
