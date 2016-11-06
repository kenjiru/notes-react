import * as React from "react";
import {connect} from "react-redux";
import {AppBar, Drawer, Snackbar} from "material-ui";

import store, {IStore, ISnackbar} from "../../model/store";
import {restoreState} from "../../model/actions";

import AppMenu from "../app-menu/AppMenu";
import FolderList from "../folder-list/FolderList";
import DeleteConfirmationDialog from "../delete-confirmation-dialog/DeleteConfirmationDialog";

class AppRoot extends React.Component<IAppRootProps, IAppRootState> {
    private SNACKBAR_TIMEOUT: number = 2000;

    constructor(props: IAppRootProps) {
        super(props);

        this.state = {
            isDrawerVisible: false,
            isSnackbarOpen: false,
            snackbarMessage: ""
        };

        store.dispatch(restoreState());
    }

    public componentWillReceiveProps(nextProps: IAppRootProps): void {
        if (this.props.snackbar !== nextProps.snackbar && _.isNil(nextProps.snackbar) === false) {
            this.showSnackbarMessage(nextProps.snackbar.message);
        }
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="app-root">
                <AppBar title={this.state.selectedFolder} onLeftIconButtonTouchTap={this.handleToggleDrawer}
                        iconElementRight={<AppMenu/>}/>
                <Drawer docked={false} open={this.state.isDrawerVisible}
                        onRequestChange={(isDrawerVisible) => this.setState({isDrawerVisible})}>
                    <FolderList onFolderSelected={this.handleFolderSelected}/>
                </Drawer>

                <div className="app-content">
                    {this.props.children}
                </div>

                <Snackbar open={this.state.isSnackbarOpen} message={this.state.snackbarMessage}
                          autoHideDuration={this.SNACKBAR_TIMEOUT} onRequestClose={this.handleSnackbarClose}/>

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

    private handleSnackbarClose = () => {
        this.hideSnackbar();
    };

    private showSnackbarMessage(snackbarMessage: string): void {
        this.setState({
            isSnackbarOpen: true,
            snackbarMessage
        });
    }

    private hideSnackbar(): void {
        this.setState({
            isSnackbarOpen: false
        });
    }

}

interface IAppRootProps {
    snackbar?: ISnackbar;
}

interface IAppRootState {
    isDrawerVisible?: boolean;
    selectedFolder?: string;
    snackbarMessage?: string;
    isSnackbarOpen?: boolean;
}

export default connect((state: IStore): IAppRootProps => ({
    snackbar: state.ui.snackbar
}))(AppRoot);
