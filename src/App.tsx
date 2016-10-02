import * as React from "react";
import * as ReactDOM from "react-dom";
import * as injectTapEventPlugin from "react-tap-event-plugin";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";

import "material-design-icons/iconfont/material-icons.css";
import "./App.less";

injectTapEventPlugin();

class App extends React.Component<any, any> {
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <h1>App title</h1>
                    <RaisedButton label="Default"/>
                </div>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(<App/>, document.body);