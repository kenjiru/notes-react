import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {AppBar, Drawer, IconButton, IconMenu, MenuItem} from "material-ui";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";

import {IUser, IStore} from "../../model/store";

import FolderList from "../folder-list/FolderList";
import DropboxAuth from "../dropbox-auth/DropboxAuth";
import {loadNotes} from "../../model/actions";

class AppRoot extends React.Component<IAppRootProps, IAppRootState> {
    constructor(props: IAppRootProps) {
        super(props);

        this.state = {
            isDrawerVisible: false,
        };
    }

    public componentWillReceiveProps(nextProps: IAppRootProps): void {
        if (this.props.user !== nextProps.user && _.isNil(nextProps.user) === false) {
            this.props.dispatch(loadNotes());
        }
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="app-root">
                <AppBar title={this.state.selectedFolder} onLeftIconButtonTouchTap={this.handleToggleDrawer}
                        iconElementRight={this.renderRightMenu()}/>
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

    private renderRightMenu(): React.ReactElement<any> {
        return (
            <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                      targetOrigin={{horizontal: "right", vertical: "top"}}
                      anchorOrigin={{horizontal: "right", vertical: "top"}}
                      width={200}>
                <DropboxAuth/>
                <MenuItem primaryText="About"/>
            </IconMenu>
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
    dispatch: Function;
    user: IUser;
}

interface IAppRootState {
    isDrawerVisible?: boolean;
    selectedFolder?: string;
}

export default connect((store: IStore) => ({
    user: store.user
}))(AppRoot);
