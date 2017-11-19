import {combineReducers} from "redux";

import {local} from "./reducers/local";
import {dropbox} from "./reducers/dropbox";
import {ui} from "./reducers/ui";
import { editorState } from "./reducers/editorState";

export default combineReducers({local, dropbox, ui, editorState});
