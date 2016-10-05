import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import * as Dropbox from "dropbox";
import {MenuItem} from "material-ui";

import {IStore, IUser} from "../../model/store";
import {setUserInfo} from "../../model/actions";

import WindowUtil from "../../utils/WindowUtil";

class DropboxAuth extends React.Component<IDropboxAuthProps, IDropboxAuthState> {
    private CLIENT_ID: string = "17zzlf216nsykj9";
    private dropboxAuthWindow: Window;
    private dropbox: any;

    constructor(props: IDropboxAuthProps) {
        super(props);

        this.dropbox = new Dropbox({clientId: this.CLIENT_ID});
    }

    public componentDidMount(): void {
        window.addEventListener("message", this.handleMessage);
    }

    public render(): React.ReactElement<any> {
        return (
            <MenuItem primaryText={this.getPrimaryText()} secondaryText={this.getSecondaryText()}
                      onClick={this.handleDropboxAction}/>
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
        console.log("Dropbox accessToken", accessToken);

        this.dropbox.setAccessToken(accessToken);
        this.dropbox.usersGetCurrentAccount().then((result) => {
            console.log("dropbox.usersGetAccount", result);

            this.props.dispatch(setUserInfo({
                accessToken,
                displayName: result.name.display_name
            }));
        });
    };

    private login(): void {
        let authUrl: string = this.dropbox.getAuthenticationUrl("http://localhost:8080/dropbox-auth.html");
        let windowOptions: string = "width=800,height=600,scrollbars=yes,location=no";

        this.dropboxAuthWindow = WindowUtil.openWindow(authUrl, windowOptions);
    }

    private logout(): void {
        this.dropbox.authTokenRevoke().then((result) => {
            this.props.dispatch(setUserInfo(null));
        });
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
    dispatch: Function;
    user: IUser;
}

interface IDropboxAuthState {
}

export default connect((store: IStore) => ({
    user: store.user
}))(DropboxAuth);
