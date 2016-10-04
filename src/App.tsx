import * as React from "react";
import * as ReactDOM from "react-dom";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import {Router, Route, browserHistory} from "react-router"
import {Provider} from "react-redux";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import store from "./model/store";

import AppRoot from "./components/app-root/AppRoot";
import Login from "./components/login/Login";
import ListNotes from "./components/list-notes/ListNotes";
import NotFound from "./components/not-found/NotFound";

import "material-design-icons/iconfont/material-icons.css";
import "./App.less";

injectTapEventPlugin();

class App extends React.Component<any, any> {
    render() {
        return (
            <MuiThemeProvider>
                <Provider store={store}>
                    <Router history={browserHistory}>
                        <Route path="/" component={AppRoot}>
                            <Route path="/login" component={Login}/>
                            <Route path="/list-notes" component={ListNotes}/>
                            <Route path="*" component={NotFound}/>
                        </Route>
                    </Router>
                </Provider>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(<App/>, document.body);