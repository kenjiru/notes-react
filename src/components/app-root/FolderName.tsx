import * as _ from "lodash";
import * as React from "react";
import {EventHandler} from "react";
import {TextField, IconButton} from "material-ui";

import store from "../../model/store";
import FolderUtil from "../../utils/FolderUtil";

import {renameFolder, selectFolder} from "../../model/actions";

import "./FolderName.less"

class FolderName extends React.Component<IFolderNameProps, IFolderNameState> {
    private smallButton: Object = {
        width: 32,
        height: 32,
        padding: 8
    };

    private smallIcon: Object = {
        width: 16,
        height: 16,
        fontSize: 16,
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
                <span>
                    Folder:
                    <span className="folder-name">{this.props.selectedFolder}</span>
                </span>

                <span className="buttons-container">
                    <IconButton iconClassName="material-icons" style={this.smallButton} iconStyle={this.smallIcon}
                                onClick={this.handleEdit}>mode_edit</IconButton>
                </span>
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
            fontSize: 18
        };

        return (
            <span className="edit-folder-name">
                <span>
                    Folder:
                    <TextField name="folder-name" style={textFieldStyle} inputStyle={inputStyle}
                               defaultValue={this.props.selectedFolder} onChange={this.handleInputChange}/>
                </span>
                <IconButton iconClassName="material-icons" style={this.smallButton} iconStyle={this.smallIcon}
                            onClick={this.handleSave}>save</IconButton>
                <IconButton iconClassName="material-icons" style={this.smallButton} iconStyle={this.smallIcon}
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
}

interface IFolderNameState {
    isEditMode?: boolean;
    newFolder?: string;
}

interface IFolderNameProps {
    selectedFolder?: string;
}

export default FolderName;
