import * as React from "react";
import {AppBar, Drawer} from "material-ui";
import FolderList from "../folder-list/FolderList";

class AppLayout extends React.Component<IAppLayoutProps, IAppLayoutState> {
    constructor(props: IAppLayoutProps) {
        super(props);

        this.state = {
            isDrawerVisible: false,
        };
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="app-layout">
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

interface IAppLayoutProps {}

interface IAppLayoutState {
    isDrawerVisible?: boolean;
    selectedFolder?: string;
}

export default AppLayout;

