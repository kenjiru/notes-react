import * as React from "react";
import * as Dropbox from "dropbox";
import {MenuItem} from "material-ui";

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
            <MenuItem primaryText="Login"
                      onClick={this.handleDropboxAction}/>
        );
    }

    handleDropboxAction = (): void => {
        this.login();
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
        });
    };

    private login(): void {
        let authUrl: string = this.dropbox.getAuthenticationUrl("http://localhost:8080/dropbox-auth.html");
        let windowOptions: string = "width=800,height=600,scrollbars=yes,location=no";

        this.dropboxAuthWindow = WindowUtil.openWindow(authUrl, windowOptions);
    }
}

interface IDropboxAuthProps {
}

interface IDropboxAuthState {
}

export default DropboxAuth;