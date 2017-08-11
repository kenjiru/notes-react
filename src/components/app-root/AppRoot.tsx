import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {InjectedRouter, withRouter} from "react-router";
import {Location} from "history";
import {AppBar, Drawer} from "material-ui";

import store, {IStore} from "../../model/store";
import {restoreState} from "../../model/actions/local";
import {setAccessToken, getCurrentAccount} from "../../model/actions/dropbox";

import {IDispatchFunction} from "../../utils/ActionUtil";

import AppMenu from "../app-menu/AppMenu";
import FolderDrawer from "../folder-drawer/FolderDrawer";
import DeleteConfirmationDialog from "../delete-confirmation-dialog/DeleteConfirmationDialog";
import SnackbarMessage from "../snackbar-message/SnackbarMessage";
import CreateFolderDialog from "../create-folder-dialog/CreateFolderDialog";
import DeleteFolderDialog from "../delete-folder-dialog/DeleteFolderDialog";
import MoveNotesDialog from "../move-notes-dialog/MoveNotesDialog";
import AboutDialog from "../about-dialog/AboutDialog";
import FolderName from "../folder-name/FolderName";
import WindowUtil from "../../utils/WindowUtil";

class AppRoot extends React.Component<IAppRootProps, IAppRootState> {
    constructor(props: IAppRootProps) {
        super(props);

        this.state = {
            isDrawerVisible: false
        };

        store.dispatch(restoreState());
        window.addEventListener("message", this.handleMessage);
    }

    public componentWillUnmount(): void {
        window.removeEventListener("message", this.handleMessage);
    }

    public componentWillReceiveProps(nextProps: IAppRootProps): void {
        if (this.props.accessToken !== nextProps.accessToken && _.isNil(nextProps.accessToken) === false) {
            this.props.dispatch(setAccessToken(nextProps.accessToken));
        }
    }

    public render(): React.ReactElement<any> {
        let containerStyle: Object = {
            overflow: "visible"
        };

        return (
            <div className="app-root">
                <AppBar title={<FolderName selectedFolder={this.props.selectedFolder}/>}
                        iconElementRight={<AppMenu location={this.props.location}/>}
                        onLeftIconButtonTouchTap={this.handleToggleDrawer}/>
                <Drawer containerClassName="app-drawer" containerStyle={containerStyle} docked={false}
                        open={this.state.isDrawerVisible}
                        onRequestChange={(isDrawerVisible) => this.setState({isDrawerVisible})}>
                    <FolderDrawer hideDrawer={this.handleHideDrawer}/>
                </Drawer>

                <div className="app-content">
                    {this.props.children}
                </div>

                <SnackbarMessage/>
                <DeleteConfirmationDialog/>
                <CreateFolderDialog/>
                <DeleteFolderDialog/>
                <MoveNotesDialog location={this.props.location} params={this.props.params}/>
                <AboutDialog/>
            </div>
        );
    }

    private handleMessage = (event: MessageEvent): void => {
        if (event.data.type !== WindowUtil.GENERIC_MESSAGE) {
            return;
        }

        this.props.dispatch(setAccessToken(event.data.payload.accessToken));
        this.props.dispatch(getCurrentAccount());
    };

    private handleToggleDrawer = (): void => {
        this.setState({
            isDrawerVisible: !this.state.isDrawerVisible
        });
    };

    private handleHideDrawer = (): void => {
        this.hideDrawer();
    };

    private hideDrawer(): void {
        this.setState({
            isDrawerVisible: false
        });
    }
}

interface IAppRootProps {
    dispatch?: IDispatchFunction;
    accessToken?: string;
    selectedFolder?: string;
    router?: InjectedRouter;
    location?: Location;
    params?: any;
}

interface IAppRootState {
    isDrawerVisible?: boolean;
}

export default connect((store: IStore, props: IAppRootProps): IAppRootProps => ({
    accessToken: store.dropbox.accessToken,
    selectedFolder: store.ui.selectedFolder,
    router: props.router,
    location: props.location,
    params: props.params
}))(withRouter(AppRoot));
