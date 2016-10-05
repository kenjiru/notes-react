import * as React from "react";
import * as Dropbox from "dropbox";
import {MenuItem} from "material-ui";

import WindowUtil from "../../utils/WindowUtil";

class DropboxAuth extends React.Component<IDropboxAuthProps, IDropboxAuthState> {
    private CLIENT_ID: string = "17zzlf216nsykj9";
    private dropboxAuthWindow: Window;

    public componentDidMount(): void {
        window.addEventListener("message", this.handleMessage);
    }

    public render(): React.ReactElement<any> {
        return (
            <MenuItem primaryText="Dropbox Login" onClick={this.handleDropboxLogin}/>
        );
    }

    handleDropboxLogin = (): void => {
        let dropbox: any = new Dropbox({clientId: this.CLIENT_ID});
        let authUrl: string = dropbox.getAuthenticationUrl("http://localhost:8080/dropbox-auth.html");

        let windowOptions: string = "width=800,height=600,scrollbars=yes,location=no";

        this.dropboxAuthWindow = WindowUtil.openWindow(authUrl, windowOptions);
    };

    handleMessage = (event: MessageEvent): void => {
        if (this.dropboxAuthWindow) {
            this.dropboxAuthWindow.close();
        }

        console.log("Dropbox accessToken", event.data.accessToken);
    };
}

interface IDropboxAuthProps {}

interface IDropboxAuthState {}

export default DropboxAuth;
