import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {MenuItem, TouchTapEvent} from "material-ui";

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

    private handleMessage = (event: MessageEvent): void => {
        if (this.dropboxAuthWindow) {
            this.dropboxAuthWindow.close();
        }

        this.getAccount(event.data.accessToken);
    };

    private login(): void {
        let authUrl: string = DropboxUtil.getAuthUrl();
        let windowOptions: string = "width=800,height=600,scrollbars=yes,location=no";

        WindowUtil.openAuthWindow(authUrl, this.handleAuth, windowOptions);
    }

    private handleAuth = (params: any): void => {
        if (_.isNil(params.access_token) === false) {
            this.getAccount(params.access_token);
        }
    };

    private getAccount(accessToken: string): void {
        this.props.dispatch(setAccessToken(accessToken));
        this.props.dispatch(getCurrentAccount());
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
    user: store.dropbox.user
}))(DropboxAuth);
