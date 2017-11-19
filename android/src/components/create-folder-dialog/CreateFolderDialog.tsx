import * as _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { Dialog, DialogContent, DialogActions, Button, TextField } from "material-ui";

import { IStore } from "notes-react-core/src/model/store";
import { createFolder } from "notes-react-core/src/model/actions/local";
import { IDispatchFunction } from "notes-react-core/src/utils/ActionUtil";

import "./CreateFolderDialog.less";

class CreateFolderDialog extends React.Component<ICreateFolderDialogProps, ICreateFolderDialogState> {
    private EMPTY_FOLDER: string = "Folder name cannot be empty";
    private FOLDER_EXISTS: string = "Folder already exists";

    constructor(props: ICreateFolderDialogProps) {
        super(props);

        this.state = {
            isDialogShown: false
        };
    }

    public componentWillReceiveProps(nextProps: ICreateFolderDialogProps): void {
        if (this.props.showCreateFolderDialog !== nextProps.showCreateFolderDialog &&
            _.isNil(nextProps.showCreateFolderDialog) === false) {
            this.showDialog();
        }
    }

    public render(): React.ReactElement<any> {
        return (
            <Dialog className="create-folder-dialog" title="Create new folder"
                    open={this.state.isDialogShown}
                    onRequestClose={this.handleCloseDialog}>
                <DialogContent>
                    <TextField className="folder-name"
                               helperText="Folder name"
                               error={this.hasError()}
                               value={this.state.folderName}
                               label={this.state.errorText}
                               onChange={this.handleInputChange}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseDialog}>Cancel</Button>
                    <Button onClick={this.handleCreateFolder}>Create</Button>
                </DialogActions>
            </Dialog>
        );
    }

    private handleInputChange = (ev: any): void => {
        this.setState({
            folderName: ev.target.value,
            errorText: null
        });
    };

    private handleCreateFolder = (): void => {
        if (this.isEmpty()) {
            this.setState({
                errorText: this.EMPTY_FOLDER
            });
        } else if (this.folderAlreadyExists()) {
            this.setState({
                errorText: this.FOLDER_EXISTS
            });
        } else {
            this.hideDialog();
            this.props.dispatch(createFolder(this.state.folderName))
        }
    };

    private handleCloseDialog = (): void => {
        this.hideDialog();
    };

    private showDialog(): void {
        this.setState({
            isDialogShown: true,
            folderName: ""
        });
    }

    private hideDialog(): void {
        this.setState({
            isDialogShown: false
        });
    }

    private folderAlreadyExists(): boolean {
        return _.some(this.props.folders, (folder: string): boolean => folder === this.state.folderName);
    }

    private isEmpty(): boolean {
        return _.isNil(this.state.folderName) || this.state.folderName === "";
    }

    private hasError(): boolean {
        return _.isEmpty(this.state.errorText) === false;
    }
}

interface ICreateFolderDialogProps {
    dispatch?: IDispatchFunction;
    showCreateFolderDialog?: Object;
    folders?: string[];
}

interface ICreateFolderDialogState {
    isDialogShown?: boolean;
    folderName?: string;
    errorText?: string;
}

export default connect((store: IStore): ICreateFolderDialogProps => ({
    showCreateFolderDialog: store.ui.showCreateFolderDialog,
    folders: store.local.folders
}))(CreateFolderDialog);
