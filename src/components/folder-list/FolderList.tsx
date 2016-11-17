import * as _ from "lodash";
import * as React from "react";
import {ReactElement} from "react";
import {connect} from "react-redux";

import {List, ListItem, Subheader, IconButton} from "material-ui";
import FileFolder from "material-ui/svg-icons/file/folder";
import FolderOpen from "material-ui/svg-icons/file/folder-open";

import {IStore} from "../../model/store";
import {selectFolder, showCreateFolderDialog} from "../../model/actions";

import {IDispatchFunction} from "../../utils/ActionUtil";
import FolderUtil from "../../utils/FolderUtil";

class FolderList extends React.Component<IFolderListProps, IFolderListState> {
    public render(): React.ReactElement<any> {
        let subheaderStyles: Object = {
            display: "inline-flex",
            verticalAlign: "middle"
        };

        return (
            <List>
                <Subheader style={subheaderStyles}>
                    <span style={{flexGrow: 2}}>Folders</span>
                    <IconButton iconClassName="material-icons" onClick={this.handleCreateFolder}>
                        create_new_folder
                    </IconButton>
                </Subheader>
                <ListItem key="all-folders" leftIcon={<FolderOpen />} primaryText={"All Notes"}
                          onClick={() => this.handleFolderClicked(FolderUtil.ALL_NOTES)}/>
                <ListItem key="no-folder" leftIcon={<FolderOpen />} primaryText={"Unfilled Notes"}
                          onClick={() => this.handleFolderClicked(FolderUtil.NO_FOLDER)}/>
                {this.renderFolders()}
            </List>
        );
    }

    private renderFolders(): ReactElement<any>[] {
        return _.map(this.props.folders, (folder: string, index: number): ReactElement<any> =>
            <ListItem key={index + folder} leftIcon={<FileFolder />} primaryText={folder}
                      onClick={() => this.handleFolderClicked(folder)}/>
        );
    }

    private handleFolderClicked = (folder: string): void => {
        this.props.dispatch(selectFolder(folder));
        this.props.hideDrawer();
    };

    private handleCreateFolder = (): void => {
        this.props.dispatch(showCreateFolderDialog());
        this.props.hideDrawer();
    };
}

interface IFolderListProps {
    dispatch?: IDispatchFunction;
    folders?: string[];
    selectedFolder?: string;
    hideDrawer?: () => void;
}

interface IFolderListState {
}

export default connect((state: IStore, props: IFolderListProps): IFolderListProps => ({
    folders: state.local.folders,
    selectedFolder: state.ui.selectedFolder,
    hideDrawer: props.hideDrawer
}))(FolderList);
