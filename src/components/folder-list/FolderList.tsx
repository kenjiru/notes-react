import * as _ from "lodash";
import * as React from "react";
import {ReactElement} from "react";
import {connect} from "react-redux";

import {List, ListItem, Subheader, IconButton} from "material-ui";
import FileFolder from "material-ui/svg-icons/file/folder";

import {IStore, INote} from "../../model/store";
import {selectFolder} from "../../model/actions";
import FolderUtil from "../../utils/FolderUtil";
import {IDispatchFunction} from "../../utils/ActionUtil";

class FolderList extends React.Component<IFolderListProps, IFolderListState> {
    constructor(props: IFolderListProps) {
        super(props);

        this.state = {
            folders: FolderUtil.getFolders(props.notes)
        };
    }

    public componentWillReceiveProps(nextProps: IFolderListProps): void {
        if (this.props.notes !== nextProps.notes) {
            this.setState({
                folders: FolderUtil.getFolders(nextProps.notes)
            });
        }
    }

    public render(): React.ReactElement<any> {
        let subheaderStyles: Object = {
            display: "inline-flex",
            verticalAlign: "middle"
        };

        return (
            <List>
                <Subheader style={subheaderStyles}>
                    <span style={{flexGrow: 2}}>Folders</span>
                    <IconButton iconClassName="material-icons">create_new_folder</IconButton>
                </Subheader>
                <ListItem key="all-folder" leftIcon={<FileFolder />} primaryText={"All notes"}
                          onClick={() => this.handleFolderClicked(-1)}/>
                {this.renderFolders()}
            </List>
        );
    }

    private renderFolders(): ReactElement<any>[] {
        return _.map(this.state.folders, (folderName: string, index: number): ReactElement<any> =>
            <ListItem key={index + folderName} leftIcon={<FileFolder />} primaryText={folderName}
                      onClick={() => this.handleFolderClicked(index)}/>
        );
    }

    handleFolderClicked = (index: number): void => {
        let selectedFolder: string;

        if (index !== -1) {
            selectedFolder = this.state.folders[index];
        }

        this.props.dispatch(selectFolder(selectedFolder));
        this.props.onFolderSelected(selectedFolder);
    };
}

interface IFolderListProps {
    dispatch?: IDispatchFunction;
    notes?: INote[];
    selectedFolder?: string;
    onFolderSelected?: (folderName: string) => void;
}

interface IFolderListState {
    folders?: string[];
}

export default connect((state: IStore, props: IFolderListProps): IFolderListProps => ({
    notes: state.local.notes,
    selectedFolder: state.ui.selectedFolder,
    onFolderSelected: props.onFolderSelected
}))(FolderList);
