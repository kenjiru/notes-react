import * as React from "react";
import {connect} from "react-redux";
import {InjectedRouter, withRouter} from "react-router";
import {Location} from "history";
import {AppBar, Drawer} from "material-ui";

import store, {IStore} from "../../model/store";
import {restoreState} from "../../model/actions";

import AppMenu from "../app-menu/AppMenu";
import FolderList from "../folder-list/FolderList";
import DeleteConfirmationDialog from "../delete-confirmation-dialog/DeleteConfirmationDialog";
import SnackbarMessage from "../snackbar-message/SnackbarMessage";
import CreateFolderDialog from "../create-folder-dialog/CreateFolderDialog";
import ChangeFolderDialog from "../move-notes-dialog/MoveNotesDialog";

class AppRoot extends React.Component<IAppRootProps, IAppRootState> {
    constructor(props: IAppRootProps) {
        super(props);

        this.state = {
            isDrawerVisible: false
        };

        store.dispatch(restoreState());
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="app-root">
                <AppBar title={this.getTitle()} onLeftIconButtonTouchTap={this.handleToggleDrawer}
                        iconElementRight={<AppMenu location={this.props.location}/>}/>
                <Drawer docked={false} open={this.state.isDrawerVisible}
                        onRequestChange={(isDrawerVisible) => this.setState({isDrawerVisible})}>
                    <FolderList hideDrawer={this.handleHideDrawer}/>
                </Drawer>

                <div className="app-content">
                    {this.props.children}
                </div>

                <SnackbarMessage/>
                <DeleteConfirmationDialog/>
                <CreateFolderDialog/>
                <ChangeFolderDialog/>
            </div>
        );
    }

    private getTitle(): string {
        let selectedFolder: string = this.props.selectedFolder;

        if (_.isNil(selectedFolder) === false) {
            return `Folder: ${selectedFolder}`;
        }

        return "All notes";
    }

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
    selectedFolder?: string;
    router?: InjectedRouter;
    location?: Location;
}

interface IAppRootState {
    isDrawerVisible?: boolean;
}

export default connect((store: IStore, props: IAppRootProps): IAppRootProps => ({
    selectedFolder: store.ui.selectedFolder,
    router: props.router,
    location: props.location
}))(withRouter(AppRoot));
