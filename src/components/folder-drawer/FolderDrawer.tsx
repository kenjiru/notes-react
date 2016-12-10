import * as _ from "lodash";
import * as React from "react";
import {ReactElement} from "react";
import {connect} from "react-redux";
import {InjectedRouter, withRouter} from "react-router";

import {List, ListItem, Subheader, FlatButton} from "material-ui";
import FileFolder from "material-ui/svg-icons/file/folder";
import FolderOpen from "material-ui/svg-icons/file/folder-open";

import {IStore} from "../../model/store";
import {selectFolder, showCreateFolderDialog, setSelectedNotes} from "../../model/actions";

import {IDispatchFunction} from "../../utils/ActionUtil";
import FolderUtil from "../../utils/FolderUtil";

import "./FolderDrawer.less";

class FolderDrawer extends React.Component<IFolderDrawerProps, IFolderDrawerState> {
    public render(): React.ReactElement<any> {
        let buttonStyle: Object = {
            flexShrink: 0
        };

        return (
            <div className="folder-drawer">
                <Subheader>Folders</Subheader>
                <div className="folder-list">
                    <List>
                        <ListItem key="all-folders" leftIcon={<FolderOpen />} primaryText={"All Notes"}
                                  onClick={() => this.handleFolderClicked(FolderUtil.ALL_NOTES)}/>
                        <ListItem key="no-folder" leftIcon={<FolderOpen />} primaryText={"Unfilled Notes"}
                                  onClick={() => this.handleFolderClicked(FolderUtil.NO_FOLDER)}/>
                        {this.renderFolders()}
                    </List>
                </div>
                <FlatButton style={buttonStyle} label="New Folder" onClick={this.handleCreateFolder}/>
            </div>
        );
    }

    private renderFolders(): ReactElement<any>[] {
        return _.map(this.props.folders, (folder: string, index: number): ReactElement<any> =>
            <ListItem key={index + folder} leftIcon={<FileFolder />} primaryText={folder}
                      onClick={() => this.handleFolderClicked(folder)}/>
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
