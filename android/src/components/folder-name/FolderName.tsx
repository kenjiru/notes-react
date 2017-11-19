import * as _ from "lodash";
import * as React from "react";
import { EventHandler } from "react";
import { TextField, IconButton, Icon } from "material-ui";

import store from "notes-react-core/src/model/store";
import FolderUtil from "notes-react-core/src/utils/FolderUtil";

import { selectFolder, showDeleteFolderDialog } from "notes-react-core/src/model/actions/ui";
import { renameFolder } from "notes-react-core/src/model/actions/local";

import "./FolderName.less"

class FolderName extends React.Component<IFolderNameProps, IFolderNameState> {
    private folderIcon: Object = {
        color: "#eee"
    };

    constructor(props: IFolderNameProps) {
        super(props);

        this.state = {
            isEditMode: false
        };
    }

    public render(): React.ReactElement<any> {
        return (
            <span className="folder-name">
                {this.renderFolder()}
            </span>
        );
    }

    private renderFolder(): React.ReactElement<any> | string {
        if (FolderUtil.isValidFolder(this.props.selectedFolder)) {
            if (this.state.isEditMode) {
                return this.renderEditFolder();
            }

            return this.renderShowFolder();
        }

        return this.renderSpecialFolder();
    }

    private renderShowFolder(): React.ReactElement<any> {
        return (
            <span className="show-folder-name">
                <span className="folder-icon">
                    <Icon style={this.folderIcon}>folder</Icon>
                </span>
                <span className="folder-name">{this.props.selectedFolder}</span>
                <span className="folder-actions">
                    <IconButton onClick={this.handleEdit}>
                        <Icon>mode_edit</Icon>
                    </IconButton>
                    <IconButton onClick={this.handleDelete}>
                        <Icon>delete</Icon>
                    </IconButton>
                </span>
            </span>
        );
    }

    private renderEditFolder(): React.ReactElement<any> | string {
        return (
            <span className="edit-folder-name">
                <span className="folder-icon">
                    <Icon style={this.folderIcon}>folder</Icon>
                </span>
                <span className="folder-name">
                    <TextField name="folder-name-text"
                               defaultValue={this.props.selectedFolder}
                               onChange={this.handleInputChange}/>
                </span>
                <span className="folder-actions">
                    <IconButton onClick={this.handleSave}>
                        <Icon>save</Icon>
                    </IconButton>
                    <IconButton onClick={this.handleCancel}>
                        <Icon>cancel</Icon>
                    </IconButton>
                </span>
            </span>
        );
    }

    private renderSpecialFolder(): string {
        let selectedFolder: string = this.props.selectedFolder;

        if (selectedFolder === FolderUtil.ALL_NOTES) {
            return "All Notes";
        } else if (selectedFolder === FolderUtil.NO_FOLDER) {
            return "Unfilled Notes";
        }
    }

    private handleInputChange: EventHandler<any> = (ev: any): void => {
        this.setState({
            newFolder: ev.target.value
        });
    };

    private handleEdit = (): void => {
        this.setState({
            isEditMode: true
        });
    };

    private handleSave = (): void => {
        let newFolder: string = this.state.newFolder;

        if (_.isEmpty(newFolder)) {
            return;
        }

        store.dispatch(renameFolder(this.props.selectedFolder, newFolder));
        store.dispatch(selectFolder(newFolder));

        this.setState({
            isEditMode: false
        });
    };

    private handleCancel = (): void => {
        this.setState({
            isEditMode: false,
            newFolder: this.props.selectedFolder
        });
    };

    private handleDelete = (): void => {
        store.dispatch(showDeleteFolderDialog(this.props.selectedFolder));
    }
}

interface IFolderNameState {
    isEditMode?: boolean;
    newFolder?: string;
}

interface IFolderNameProps {
    selectedFolder?: string;
}

export default FolderName;
