import * as _ from "lodash";
import * as storage from "store";

import {IStore, INote} from "../store";
import {IAction, IActionCallback, IDispatchFunction, IGetStateFunction, createAction} from "../../utils/ActionUtil";
import NoteUtil from "../../utils/NoteUtil";
import IdUtil from "../../utils/IdUtil";
import FolderUtil from "../../utils/FolderUtil";

import {CONFIRM_DELETION} from "./ui";

export const SET_NOTES: string = "SET_NOTES";
export const SET_FOLDERS: string = "SET_FOLDERS";

export const CREATE_NEW_NOTE: string = "CREATE_NEW_NOTE";
export function createNewNote(noteId: string): IActionCallback {
    return (dispatch: IDispatchFunction, getState: IGetStateFunction): Promise<any> => {
        let folder: string = getState().ui.selectedFolder;
        let newNote: INote = NoteUtil.createNewNote(noteId, folder);

        dispatch(createAction(CREATE_NEW_NOTE, newNote));

        return dispatch(persistState());
    };
}

export const DELETE_NOTES: string = "DELETE_NOTES";
export function deleteNotes(notes: INote[]): IActionCallback {
    return (dispatch: IDispatchFunction): Promise<any> => {
        console.log("deleteNotes");
        dispatch(createAction(DELETE_NOTES, notes));
        dispatch(createAction(CONFIRM_DELETION, IdUtil.getNodeListId(notes)));

        return dispatch(persistState());
    };
}

export const UPDATE_NOTE: string = "UPDATE_NOTE";
export function updateNote(note: INote): IActionCallback {
    return (dispatch: IDispatchFunction): Promise<any> => {
        console.log("updateNote", note);
        dispatch(createAction(UPDATE_NOTE, note));

        return dispatch(persistState());
    };
}

export const UPDATE_ALL_NOTES: string = "UPDATE_ALL_NOTES";
export function moveNotesTo(notes: INote[], folder: string): IActionCallback {
    return (dispatch: IDispatchFunction): Promise<any> => {
        let notesToMove: INote[] = _.clone(notes);
        _.each(notesToMove, (note: INote): void => FolderUtil.setFolder(note, folder));

        dispatch(createAction(UPDATE_ALL_NOTES, notesToMove));
        return dispatch(persistState());
    };
}

export const CREATE_NEW_FOLDER: string = "CREATE_NEW_FOLDER";
export function createFolder(folderName: string): IActionCallback {
    return (dispatch: IDispatchFunction): Promise<any> => {
        let folderTemplate: INote = NoteUtil.createTemplateNote(folderName);

        dispatch(createAction(CREATE_NEW_FOLDER, folderName));
        return dispatch(createAction(CREATE_NEW_NOTE, folderTemplate));
    };
}

export const RENAME_FOLDER: string = "RENAME_FOLDER";
export function renameFolder(oldName: string, newName: string): IActionCallback {
    return (dispatch: IDispatchFunction, getState: IGetStateFunction): Promise<any> => {
        let state: IStore = getState();
        let notesToUpdate: INote[] = FolderUtil.getAllNotesInFolder(state.local.notes, oldName);

        notesToUpdate = _.clone(notesToUpdate);
        _.each(notesToUpdate, (note: INote): void => FolderUtil.setFolder(note, newName));

        dispatch(createAction(UPDATE_ALL_NOTES, notesToUpdate));
        dispatch(createAction(RENAME_FOLDER, {oldName, newName}));

        return dispatch(persistState());
    };
}

export const DELETE_FOLDER: string = "DELETE_FOLDER";
export function deleteFolder(folderName: string): IActionCallback {
    return (dispatch: IDispatchFunction, getState: IGetStateFunction): Promise<any> => {
        let state: IStore = getState();
        let notesToUpdate: INote[] = FolderUtil.getAllNotesInFolder(state.local.notes, folderName);
        let templateNote: INote = _.find(notesToUpdate, (note: INote): boolean => NoteUtil.isTemplateNote(note));

        notesToUpdate = _.filter(notesToUpdate, (note: INote): boolean => NoteUtil.isTemplateNote(note) === false);
        notesToUpdate = _.clone(notesToUpdate);
        _.each(notesToUpdate, (note: INote): void => FolderUtil.setFolder(note, null));

        if (_.isNil(templateNote) === false) {
            dispatch(deleteNotes([templateNote]));
        }

        dispatch(createAction(UPDATE_ALL_NOTES, notesToUpdate));
        dispatch(createAction(DELETE_FOLDER, folderName));

        return dispatch(persistState());
    };
}

export const RESTORE_STATE: string = "RESTORE_STATE";
export function restoreState(): IAction {
    let newState: IStore = storage.get("store");

    console.log("restoreState", newState);
    return createAction(RESTORE_STATE, newState);
}

export const PERSIST_STATE: string = "PERSIST_STATE";
export function persistState(): IActionCallback {
    return (dispatch: IDispatchFunction, getState: IGetStateFunction): Promise<any> => {
        storage.set("store", getState());

        console.log("persistState", getState());
        return dispatch(createAction(PERSIST_STATE));
    };
}
