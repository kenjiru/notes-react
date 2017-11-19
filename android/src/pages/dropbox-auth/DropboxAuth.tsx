import * as _ from "lodash";
import * as React from "react";

import WindowUtil from "notes-react-core/src/utils/WindowUtil";

class DropboxAuth extends React.Component<{}> {
    public componentDidMount(): void {
        let accessToken: string = WindowUtil.getQueryParam("access_token");
        let tokenType: string = WindowUtil.getQueryParam("token_type");
        let uid: string = WindowUtil.getQueryParam("uid");
        let state: string = WindowUtil.getQueryParam("state");

        if (_.isNil(accessToken) === false) {
            // This does not work in Cordova
            window.close();
        }

        WindowUtil.postMessageToParent({ accessToken, tokenType, uid, state });
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="dropbox-landing"></div>
        );
    }
}

export default DropboxAuth;
