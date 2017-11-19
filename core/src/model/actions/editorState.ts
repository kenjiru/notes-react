import { createAction, IAction } from "../../utils/ActionUtil";

export const EDITOR_SET_STATE: string = "EDITOR_SET_STATE";

export function setEditorState(state: any): IAction {
    return createAction(EDITOR_SET_STATE, state);
}

export const EDITOR_TOGGLE_MARK: string = "EDITOR_TOGGLE_MARK";

export function toggleMark(mark: string): IAction {
    return createAction(EDITOR_TOGGLE_MARK, mark);
}

export const EDITOR_TOGGLE_BLOCK: string = "EDITOR_TOGGLE_BLOCK";

export function toggleBlock(block: string): IAction {
    return createAction(EDITOR_TOGGLE_BLOCK, block);
}
