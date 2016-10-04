import * as React from "react";
import {IRouter, withRouter} from "react-router";
import {AppBar, Drawer} from "material-ui";

import FolderList from "../folder-list/FolderList";

class AppRoot extends React.Component<IAppRootProps, IAppRootState> {
    constructor(props: IAppRootProps) {
        super(props);

        this.state = {
            isDrawerVisible: false,
        };
    }

    public componentDidMount(): void {
        this.props.router.push("/list-notes");
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="app-root">
                <AppBar title={this.state.selectedFolder} onLeftIconButtonTouchTap={this.handleToggleDrawer}/>
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
    router: IRouter
}

interface IAppRootState {
    isDrawerVisible?: boolean;
    selectedFolder?: string;
}

export default withRouter(AppRoot);
