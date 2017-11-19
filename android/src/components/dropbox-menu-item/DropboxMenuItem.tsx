import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import { MenuItem } from "material-ui";

import { IStore, IUser } from "notes-react-core/src/model/store";
import { setAccessToken, getCurrentAccount, revokeAccess } from "notes-react-core/src/model/actions/dropbox";

import WindowUtil from "notes-react-core/src/utils/WindowUtil";
import DropboxUtil from "notes-react-core/src/utils/DropboxUtil";

class DropboxMenuItem extends React.Component<IDropboxMenuItemProps> {
    public render(): React.ReactElement<any> {
        return (
            <MenuItem onClick={this.handleDropboxAction}>
                {this.getPrimaryText()}
            </MenuItem>
        );
    }

    handleDropboxAction = (): void => {
        if (this.isUserLoggedIn()) {
            this.logout();
        } else {
            this.login();
        }

        this.props.closeMenu();
    };

    private login(): void {
        let authUrl: string = DropboxUtil.getAuthUrl();
        let windowOptions: string = "width=800,height=600,scrollbars=yes,location=no";

        WindowUtil.openAuthWindow(authUrl, this.handleAuth, windowOptions);
    }

    private handleAuth = (params: IAuthenticationParams): void => {
        if (_.isNil(params.accessToken) === false) {
            this.getAccount(params.accessToken);
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

interface IAuthenticationParams {
    accessToken: string;
    tokenType: string;
    uid: string;
    state: string;
}

interface IDropboxMenuItemProps {
    dispatch?: Function;
    user?: IUser;
    closeMenu?: () => void;

    // Props we need to pass to the MenuItem
    desktop?: string;
    focusState?: string;
    onTouchTap?: (ev) => void;
}

export default connect<any, any, IDropboxMenuItemProps>((store: IStore): IDropboxMenuItemProps => ({
    user: store.dropbox.user
}))(DropboxMenuItem);
