import * as _ from "lodash";
import * as React from "react";
import {ReactElement} from "react";
import {List, ListItem, Subheader} from "material-ui";
import FileFolder from "material-ui/svg-icons/file/folder";

class FolderList extends React.Component<IFolderListProps, IFolderListState> {
    private folders: string[] = ["Hardware", "Work", "Books"];

    public render(): React.ReactElement<any> {
        return (
            <List>
                <Subheader>Folders</Subheader>
                {this.renderFolders()}
            </List>
        );
    }

    private renderFolders(): ReactElement<any>[] {
        return _.map(this.folders, (folderName: string, index: number): ReactElement<any> =>
            <ListItem key={index + folderName} leftIcon={<FileFolder />} primaryText={folderName}
                      onClick={() => this.handleFolderClicked(index)}/>
        );
    }

    handleFolderClicked = (index: number): void => {
        let selectedFolder: string = this.folders[index];

        this.props.onFolderSelected(selectedFolder);
    };
}

interface IFolderListProps {
    onFolderSelected: (folderName: string) => void;
}

interface IFolderListState {}

export default FolderList;
