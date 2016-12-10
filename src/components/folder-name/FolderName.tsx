import * as _ from "lodash";
import * as React from "react";
import {EventHandler} from "react";
import {TextField, IconButton} from "material-ui";

import store from "../../model/store";
import FolderUtil from "../../utils/FolderUtil";

import {selectFolder, renameFolder, showDeleteFolderDialog} from "../../model/actions";

import "./FolderName.less"

class FolderName extends React.Component<IFolderNameProps, IFolderNameState> {
    private smallIcon: Object = {
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

    private renderFolder(): React.ReactElement<any>|string {
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
                Folder:
                <span className="folder-name">{this.props.selectedFolder}</span>
                <IconButton iconClassName="material-icons" iconStyle={this.smallIcon}
                            onClick={this.handleEdit}>mode_edit</IconButton>
                <IconButton iconClassName="material-icons" iconStyle={this.smallIcon}
                            onClick={this.handleDelete}>delete</IconButton>
            </span>
        );
    }

    private renderEditFolder(): React.ReactElement<any>|string {
        let textFieldStyle: Object = {
            width: 140,
            marginLeft: 10
        };

        let inputStyle: Object = {
            color: "white",
            fontSize: 24
        };

        return (
            <span className="edit-folder-name">
                <span>
                    Folder:
                    <TextField name="folder-name" style={textFieldStyle} inputStyle={inputStyle}
                               defaultValue={this.props.selectedFolder} onChange={this.handleInputChange}/>
                </span>
                <IconButton iconClassName="material-icons" iconStyle={this.smallIcon}
                            onClick={this.handleSave}>save</IconButton>
                <IconButton iconClassName="material-icons" iconStyle={this.smallIcon}
                            onClick={this.handleCancel}>cancel</IconButton>
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
