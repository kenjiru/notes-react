import * as React from "react";
import {connect} from "react-redux";
import { Dialog, DialogContent, DialogActions, Button } from "material-ui";

import FolderUtil from "notes-react-core/src/utils/FolderUtil";
import { IDispatchFunction } from "notes-react-core/src/utils/ActionUtil";

import { IStore } from "notes-react-core/src/model/store";
import { showSnackbarMessage, setSelectedNotes, selectFolder } from "notes-react-core/src/model/actions/ui";
import { deleteFolder } from "notes-react-core/src/model/actions/local";

class DeleteFolderDialog extends React.Component<IDeleteFolderDialogProps, IDeleteFolderDialogState> {
    constructor(props: IDeleteFolderDialogProps) {
        super(props);

        this.state = {
            isDialogShown: false
        };
    }

    public componentWillReceiveProps(nextProps: IDeleteFolderDialogProps): void {
        if (this.props.showDeleteFolderDialog !== nextProps.showDeleteFolderDialog) {
            this.setState({
                isDialogShown: true
            });
        }
    }

    public render(): React.ReactElement<any> {
        return (
            <Dialog className="delete-folder-dialog" title="Confirm folder deletion"
                    open={this.state.isDialogShown} onRequestClose={this.handleCloseDialog}>
                <DialogContent>
                    Are you sure you want to delete the folder {this.props.folderToDelete}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseDialog}>Cancel</Button>
                    <Button onClick={this.handleDeleteFolder}>Delete</Button>
                </DialogActions>
            </Dialog>
        );
    }

    private handleCloseDialog = () => {
        this.hideDialog();
    };

    private handleDeleteFolder = () => {
        this.hideDialog();
        this.showSnackbarMessage();

        this.props.dispatch(selectFolder(FolderUtil.ALL_NOTES));
        this.props.dispatch(setSelectedNotes([]));
        this.props.dispatch(deleteFolder(this.props.folderToDelete));
    };

    private hideDialog(): void {
        this.setState({
            isDialogShown: false
        });
    }

    private showSnackbarMessage(): void {
        let message: string = `Deleted the folder ${this.props.folderToDelete}!`;

        this.props.dispatch(showSnackbarMessage(message));
    }
}

interface IDeleteFolderDialogState {
    isDialogShown?: boolean;
}

interface IDeleteFolderDialogProps {
    dispatch?: IDispatchFunction;
    showDeleteFolderDialog?: Object;
    folderToDelete?: string;
}

export default connect((state: IStore): IDeleteFolderDialogProps => ({
    showDeleteFolderDialog: state.ui.showDeleteFolderDialog,
    folderToDelete: state.ui.folderToDelete
}))(DeleteFolderDialog);
