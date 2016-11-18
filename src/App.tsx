import * as _ from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import {Router, Route, IndexRoute, browserHistory, hashHistory} from "react-router"
import {Provider} from "react-redux";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as arrayFrom from "array.from";

import store from "./model/store";

import AppRoot from "./components/app-root/AppRoot";
import Login from "./components/login/Login";
import NoteList from "./components/note-list/NoteList";
import EditNote from "./components/edit-note/EditNote";
import ViewNote from "./components/view-note/ViewNote";
import NotFound from "./components/not-found/NotFound";

import "material-design-icons/iconfont/material-icons.css";
import "draft-js/dist/Draft.css";
import "./App.less";

injectTapEventPlugin();
arrayFrom.shim();

const history: any = typeof cordova === "undefined" ? browserHistory : hashHistory;

class App extends React.Component<any, any> {
    render() {
        return (
            <MuiThemeProvider>
                <Provider store={store}>
                    <Router history={history}>
                        <Route path="/" component={AppRoot}>
                            <IndexRoute component={NoteList}/>
                            <Route path="login" component={Login}/>
                            <Route path="list-notes" component={NoteList}/>
                            <Route path="edit-note/:noteId" component={EditNote}/>
                            <Route path="view-note/:noteId" component={ViewNote}/>
                            <Route path="*" component={NotFound}/>
                        </Route>
                    </Router>
                </Provider>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(<App/>, document.body);
