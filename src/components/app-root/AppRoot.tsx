import * as React from "react";
import {AppBar, Drawer} from "material-ui";

import AppMenu from "../app-menu/AppMenu";
import FolderList from "../folder-list/FolderList";
import store from "../../model/store";
import {restoreState} from "../../model/actions";

class AppRoot extends React.Component<IAppRootProps, IAppRootState> {
    constructor(props: IAppRootProps) {
        super(props);

        this.state = {
            isDrawerVisible: false,
        };

        store.dispatch(restoreState());
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
}

interface IAppRootState {
    isDrawerVisible?: boolean;
    selectedFolder?: string;
}

export default AppRoot;
