import { IAction } from "../../utils/ActionUtil";
import { EDITOR_SET_STATE, EDITOR_TOGGLE_BLOCK, EDITOR_TOGGLE_MARK } from "../actions/editorState";
import SlateUtil from "../../utils/SlateUtil";

export function editorState(store: any = {}, action: IAction): any {
    switch (action.type) {
        case EDITOR_SET_STATE:
            return action.payload;

        case EDITOR_TOGGLE_MARK:
            return SlateUtil.toggleMark(this.state.editorState, action.payload);

        case EDITOR_TOGGLE_BLOCK:
            return SlateUtil.toggleBlock(this.state.editorState, action.payload);
    }

    return store;
}
