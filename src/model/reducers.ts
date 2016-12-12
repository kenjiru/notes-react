import {combineReducers} from "redux";

import {local} from "./reducers/local";
import {dropbox} from "./reducers/dropbox";
import {ui} from "./reducers/ui";

export default combineReducers({local, dropbox, ui});
