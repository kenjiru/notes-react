import * as React from "react";
import {InjectedRouter, withRouter} from "react-router";
import {Location} from "history";
import {AppBar, Drawer} from "material-ui";

import store from "../../model/store";
import {restoreState} from "../../model/actions";

import AppMenu from "../app-menu/AppMenu";
import FolderList from "../folder-list/FolderList";
import DeleteConfirmationDialog from "../delete-confirmation-dialog/DeleteConfirmationDialog";
import SnackbarMessage from "../snackbar-message/SnackbarMessage";

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
                <AppBar title={this.state.selectedFolder} onLeftIconButtonTouchTap={this.handleToggleDrawer}
                        iconElementRight={<AppMenu router={this.props.router} location={this.props.location}/>}/>
                <Drawer docked={false} open={this.state.isDrawerVisible}
                        onRequestChange={(isDrawerVisible) => this.setState({isDrawerVisible})}>
                    <FolderList onFolderSelected={this.handleFolderSelected}/>
                </Drawer>

                <div className="app-content">
                    {this.props.children}
                </div>

                <SnackbarMessage/>
                <DeleteConfirmationDialog/>
            </div>
        );
    }

    handleToggleDrawer = (): void => {
        this.setState({
            isDrawerVisible: !this.state.isDrawerVisible
        });
    };

    handleFolderSelected = (selectedFolder: string): void => {
        this.setState({
            selectedFolder,
            isDrawerVisible: false
        });
    };
}

interface IAppRootProps {
    router?: InjectedRouter;
    location?: Location;
}

interface IAppRootState {
    isDrawerVisible?: boolean;
    selectedFolder?: string;
}

export default withRouter(AppRoot);
