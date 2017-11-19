import * as React from "react";
import { connect } from "react-redux";
import { Dialog, DialogContent, DialogActions, Button } from "material-ui";

import { IDispatchFunction } from "notes-react-core/src/utils/ActionUtil";

import { IStore, INote } from "notes-react-core/src/model/store";
import { deleteNotes } from "notes-react-core/src/model/actions/local";
import { setSelectedNotes, showSnackbarMessage } from "notes-react-core/src/model/actions/ui";

class DeleteConfirmationDialog extends React.Component<IDeleteConfirmationDialogProps, IDeleteConfirmationDialogState> {
    constructor(props: IDeleteConfirmationDialogProps) {
        super(props);

        this.state = {
            isDialogShown: false,
            deleteMessage: ""
        };
    }

    public componentWillReceiveProps(nextProps: IDeleteConfirmationDialogProps): void {
        if (this.props.notesToDelete !== nextProps.notesToDelete && nextProps.notesToDelete.length > 0) {
            this.showDialog(nextProps.notesToDelete);
        }
    }

    public render(): React.ReactElement<any> {
        return (
            <Dialog className="delete-confirmation-dialog" title="Confirm deletion"
                    open={this.state.isDialogShown} onRequestClose={this.handleCloseDialog}>
                <DialogContent>
                    {this.state.deleteMessage}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseDialog}>Cancel</Button>
                    <Button onClick={this.handleDeleteNotes}>Delete</Button>
                </DialogActions>
            </Dialog>
        );
    }

    private showDialog(notesToDelete: INote[]): void {
        let message: string = "Are you sure you want to delete ";

        if (notesToDelete.length > 1) {
            message += `${notesToDelete.length} notes`;
        } else {
            message += `the note '${notesToDelete[0].title}'`;
        }

        this.setState({
            isDialogShown: true,
            deleteMessage: message
        });
    }

    private hideDialog(): void {
        this.setState({
            isDialogShown: false,
            deleteMessage: ""
        });
    }

    private handleCloseDialog = () => {
        this.hideDialog();
    };

    private handleDeleteNotes = () => {
        this.hideDialog();
        this.deleteSelectedNotes();
        this.showSnackbarMessage();
        this.resetSelectedNotes();
    };

    private deleteSelectedNotes(): void {
        this.props.dispatch(deleteNotes(this.props.notesToDelete));
    }

    private showSnackbarMessage(): void {
        let notesToDelete: INote[] = this.props.notesToDelete;
        let message: string;

        if (notesToDelete.length > 1) {
            message = `Deleted ${notesToDelete.length} notes!`;
        } else {
            message = `Deleted note '${notesToDelete[0].title}'`;
        }

        this.props.dispatch(showSnackbarMessage(message));
    }

    private resetSelectedNotes(): void {
        this.props.dispatch(setSelectedNotes([]));
    }
}

interface IDeleteConfirmationDialogProps {
    notesToDelete?: INote[];
    dispatch?: IDispatchFunction;
}

interface IDeleteConfirmationDialogState {
    isDialogShown?: boolean;
    deleteMessage?: string;
}

export default connect((state: IStore): IDeleteConfirmationDialogProps => ({
    notesToDelete: state.ui.notesToDelete
}))(DeleteConfirmationDialog);
