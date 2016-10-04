import * as React from "react";
import * as ReactDOM from "react-dom";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import { Router, Route, IndexRoute, browserHistory } from "react-router"

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import AppLayout from "./components/app-layout/AppLayout";
import NotFound from "./components/not-found/NotFound";
import ListNotes from "./components/list-notes/ListNotes";

import "material-design-icons/iconfont/material-icons.css";
import "./App.less";

injectTapEventPlugin();

class App extends React.Component<any, any> {
    render() {
        return (
            <MuiThemeProvider>
                <Router history={browserHistory}>
                    <Route path="/" component={AppLayout}>
                        <IndexRoute component={ListNotes} />
                        <Route path="*" component={NotFound} />
                    </Route>
                </Router>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(<App/>, document.body);