import * as _ from "lodash";
import * as React from "react";
import {ReactElement} from "react";
import {connect} from "react-redux";

import {List, ListItem, Subheader} from "material-ui";
import FileFolder from "material-ui/svg-icons/file/folder";

import {IStore, INote} from "../../model/store";
import FolderUtil from "../../utils/FolderUtil";

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
        return (
            <List>
                <Subheader>Folders</Subheader>
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
        let selectedFolder: string = this.state.folders[index];

        this.props.onFolderSelected(selectedFolder);
    };
}

interface IFolderListProps {
    onFolderSelected: (folderName: string) => void;
    notes?: INote[];
}

interface IFolderListState {
    folders?: string[];
}

export default connect((state: IStore, props: IFolderListProps): IFolderListProps => ({
    notes: state.local.notes,
    onFolderSelected: props.onFolderSelected
}))(FolderList);
