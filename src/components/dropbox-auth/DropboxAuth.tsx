import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {MenuItem} from "material-ui";
import {TouchTapEvent} from "material-ui/commons";

import {IStore, IUser} from "../../model/store";
import {setAccessToken, getCurrentAccount, revokeAccess} from "../../model/actions";

import WindowUtil from "../../utils/WindowUtil";
import DropboxUtil from "../../utils/DropboxUtil";

class DropboxAuth extends React.Component<IDropboxAuthProps, IDropboxAuthState> {
    private dropboxAuthWindow: Window;

    public componentDidMount(): void {
        window.addEventListener("message", this.handleMessage);
    }

    public render(): React.ReactElement<any> {
        return (
            <MenuItem primaryText={this.getPrimaryText()} secondaryText={this.getSecondaryText()}
                      onClick={this.handleDropboxAction} focusState={this.props.focusState}
                      onTouchTap={this.props.onTouchTap}/>
        );
    }

    handleDropboxAction = (): void => {
        if (this.isUserLoggedIn()) {
            this.logout();
        } else {
            this.login();
        }
    };

    handleMessage = (event: MessageEvent): void => {
        if (this.dropboxAuthWindow) {
            this.dropboxAuthWindow.close();
        }

        let accessToken: string = event.data.accessToken;

        this.props.dispatch(setAccessToken(accessToken));
        this.props.dispatch(getCurrentAccount());
    };

    private login(): void {
        let authUrl: string = DropboxUtil.getAuthUrl();
        let windowOptions: string = "width=800,height=600,scrollbars=yes,location=no";

        this.dropboxAuthWindow = WindowUtil.openWindow(authUrl, windowOptions);
    }

    private logout(): void {
        this.props.dispatch(revokeAccess());
    }

    private getPrimaryText(): string {
        return this.isUserLoggedIn() ? this.props.user.displayName : "Dropbox Login";
    }

    private getSecondaryText(): string {
        return this.isUserLoggedIn() ? "Logout" : null;
    }

    private isUserLoggedIn(): boolean {
        return _.isNil(this.props.user) === false;
    }
}

interface IDropboxAuthProps {
    dispatch?: Function;
    user?: IUser;

    // Props we need to pass to the MenuItem
    desktop?: string;
    focusState?: string;
    onTouchTap?: (ev: TouchTapEvent) => void;
}

interface IDropboxAuthState {
}

export default connect((store: IStore): IDropboxAuthProps => ({
    user: store.user
}))(DropboxAuth);
