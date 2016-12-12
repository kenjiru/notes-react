import {INote} from "../store";
import {IAction, createAction} from "../../utils/ActionUtil";

export const SET_SELECTED_NOTES: string = "SET_SELECTED_NOTES";
export function setSelectedNotes(notes: INote[]): IAction {
    return createAction(SET_SELECTED_NOTES, notes);
}

export const SHOW_MOVE_NOTES_DIALOG: string = "SHOW_MOVE_NOTES_DIALOG";
export function showMoveNotesDialog(): IAction {
    return createAction(SHOW_MOVE_NOTES_DIALOG);
}

export const SHOW_CREATE_FOLDER_DIALOG: string = "SHOW_CREATE_FOLDER_DIALOG";
export function showCreateFolderDialog(): IAction {
    return createAction(SHOW_CREATE_FOLDER_DIALOG);
}

export const SHOW_ABOUT_DIALOG: string = "SHOW_ABOUT_DIALOG";
export function showAboutDialog(): IAction {
    return createAction(SHOW_ABOUT_DIALOG);
}

export const SHOW_DELETE_FOLDER_DIALOG: string = "SHOW_DELETE_FOLDER_DIALOG";
export function showDeleteFolderDialog(folderToDelete: string): IAction {
    return createAction(SHOW_DELETE_FOLDER_DIALOG, folderToDelete);
}

export const SHOW_SNACKBAR_MESSAGE: string = "SHOW_SNACKBAR_MESSAGE";
export function showSnackbarMessage(message: string): IAction {
    return createAction(SHOW_SNACKBAR_MESSAGE, message);
}

export const CONFIRM_DELETION: string = "CONFIRM_DELETION";
export const CONFIRMATION_DELETION: string = "CONFIRMATION_DELETION";
export function confirmDeletion(noteToDelete): IAction {
    return createAction(CONFIRMATION_DELETION, noteToDelete);
}

export const SELECT_FOLDER: string = "SELECT_FOLDER";
export function selectFolder(folder): IAction {
    return createAction(SELECT_FOLDER, folder);
}
