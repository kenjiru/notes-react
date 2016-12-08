import * as React from "react";
import {connect} from "react-redux";
import {InjectedRouter, withRouter} from "react-router";
import {Location} from "history";
import {AppBar, Drawer} from "material-ui";

import store, {IStore} from "../../model/store";
import {restoreState} from "../../model/actions";
import FolderUtil from "../../utils/FolderUtil";

import AppMenu from "../app-menu/AppMenu";
import FolderList from "../folder-list/FolderList";
import DeleteConfirmationDialog from "../delete-confirmation-dialog/DeleteConfirmationDialog";
import SnackbarMessage from "../snackbar-message/SnackbarMessage";
import CreateFolderDialog from "../create-folder-dialog/CreateFolderDialog";
import MoveNotesDialog from "../move-notes-dialog/MoveNotesDialog";
import AboutDialog from "../about-dialog/AboutDialog";

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
                <MoveNotesDialog location={this.props.location} params={this.props.params}/>
                <AboutDialog/>
            </div>
        );
    }

    private getTitle(): string {
        let selectedFolder: string = this.props.selectedFolder;

        if (selectedFolder === FolderUtil.ALL_NOTES) {
            return "All Notes";
        } else if (selectedFolder === FolderUtil.NO_FOLDER) {
            return "Unfilled Notes";
        }

        return `Folder: ${selectedFolder}`;
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
    params?: any;
}

interface IAppRootState {
    isDrawerVisible?: boolean;
}

export default connect((store: IStore, props: IAppRootProps): IAppRootProps => ({
    selectedFolder: store.ui.selectedFolder,
    router: props.router,
    location: props.location,
    params: props.params
}))(withRouter(AppRoot));
