import * as _ from "lodash";
import * as React from "react";
import { ReactElement } from "react";
import { connect } from "react-redux";
import { InjectedRouter, withRouter } from "react-router";

import { List, ListSubheader, ListItem, ListItemIcon, ListItemText, Button } from "material-ui";
import FileFolder from "material-ui-icons/Folder";
import FolderOpen from "material-ui-icons/FolderOpen";

import { IStore } from "notes-react-core/src/model/store";
import { selectFolder, showCreateFolderDialog, setSelectedNotes } from "notes-react-core/src/model/actions/ui";

import { IDispatchFunction } from "notes-react-core/src/utils/ActionUtil";
import FolderUtil from "notes-react-core/src/utils/FolderUtil";

import "./FolderDrawer.less";

class FolderDrawer extends React.Component<IFolderDrawerProps, IFolderDrawerState> {
    public render(): React.ReactElement<any> {
        let buttonStyle: Object = {
            flexShrink: 0
        };

        return (
            <div className="folder-drawer">
                <div className="folder-list">
                    <List subheader={<ListSubheader>Folders</ListSubheader>}>
                        <ListItem key="all-folders"
                                  onClick={() => this.handleFolderClicked(FolderUtil.ALL_NOTES)}>
                            <ListItemIcon><FolderOpen/></ListItemIcon>
                            <ListItemText primary="All Notes"/>
                        </ListItem>
                        <ListItem key="no-folder"
                                  onClick={() => this.handleFolderClicked(FolderUtil.NO_FOLDER)}>
                            <ListItemIcon><FolderOpen/></ListItemIcon>
                            <ListItemText primary="Unfilled Notes"/>
                        </ListItem>
                        {this.renderFolders()}
                    </List>
                </div>
                <Button style={buttonStyle} onClick={this.handleCreateFolder}>New Folder</Button>
            </div>
        );
    }

    private renderFolders(): ReactElement<any>[] {
        return _.map(this.props.folders, (folder: string, index: number): ReactElement<any> =>
            <ListItem key={index + folder}
                      onClick={() => this.handleFolderClicked(folder)}>
                <ListItemIcon><FileFolder/></ListItemIcon>
                <ListItemText primary={folder}/>
            </ListItem>
        );
    }

    private handleFolderClicked = (folder: string): void => {
        if (this.props.selectedFolder !== folder) {
            this.props.dispatch(selectFolder(folder));
            this.props.dispatch(setSelectedNotes([]));
        }

        this.switchToNotesList();
    };

    private handleCreateFolder = (): void => {
        this.props.dispatch(showCreateFolderDialog());
        this.props.dispatch(setSelectedNotes([]));

        this.switchToNotesList();
    };

    private switchToNotesList(): void {
        this.props.hideDrawer();

        if (this.props.router.isActive("/list-notes") === false) {
            this.props.router.push("/list-notes");
        }
    }
}

interface IFolderDrawerProps {
    dispatch?: IDispatchFunction;
    folders?: string[];
    selectedFolder?: string;
    hideDrawer?: () => void;
    router?: InjectedRouter;
}

interface IFolderDrawerState {
}

export default connect((state: IStore, props: IFolderDrawerProps): IFolderDrawerProps => ({
    folders: state.local.folders,
    selectedFolder: state.ui.selectedFolder,
    hideDrawer: props.hideDrawer
}))(withRouter(FolderDrawer));
