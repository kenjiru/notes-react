import * as React from "react";
import {connect} from "react-redux";
import {Dialog, FlatButton} from "material-ui";

import FolderUtil from "../../utils/FolderUtil";
import {IDispatchFunction} from "../../utils/ActionUtil";

import {IStore} from "../../model/store";
import {showSnackbarMessage, setSelectedNotes, selectFolder} from "../../model/actions/ui";
import {deleteFolder} from "../../model/actions/local";

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
        let deleteDialogActions: React.ReactElement<any>[] = [
            <FlatButton label="Cancel" primary={true} onClick={this.handleCloseDialog}/>,
            <FlatButton label="Delete" primary={true} onClick={this.handleDeleteFolder}/>
        ];

        return (
            <Dialog className="delete-folder-dialog" title="Confirm folder deletion" actions={deleteDialogActions}
                    modal={true} open={this.state.isDialogShown} onRequestClose={this.handleCloseDialog}>
                Are you sure you want to delete the folder {this.props.folderToDelete}?
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
