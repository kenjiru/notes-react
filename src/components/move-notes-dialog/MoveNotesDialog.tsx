import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {Location} from "history";
import {Dialog, FlatButton, SelectField, MenuItem} from "material-ui";

import {IStore, INote} from "../../model/store";
import {moveNotesTo, showSnackbarMessage, setSelectedNotes} from "../../model/actions";

import {IDispatchFunction} from "../../utils/ActionUtil";
import FolderUtil from "../../utils/FolderUtil";

class MoveNotesDialog extends React.Component<IMoveNotesDialogProps, IMoveNotesDialogState> {
    private static SELECT_DIFFERENT_FOLDER: string = "Please choose a different folder!";
    private static SELECT_OPTION: string = "Please select an option!";

    constructor(props: IMoveNotesDialogProps) {
        super(props);

        this.state = {
            isDialogShown: false,
            folder: this.getCommonFolder(props)
        };
    }

    public componentWillReceiveProps(nextProps: IMoveNotesDialogProps): void {
        if (this.props.showMoveNotesDialog !== nextProps.showMoveNotesDialog &&
            _.isNil(nextProps.showMoveNotesDialog) === false) {

            this.showDialog();
        }

        if ((this.props.selectedNotes !== nextProps.selectedNotes && nextProps.selectedFolder.length > 0) ||
            this.props.params.noteId !== nextProps.params.noteId) {

            this.setState({
                folder: this.getCommonFolder(nextProps)
            });
        }
    }

    public render(): React.ReactElement<any> {
        let dialogActions: React.ReactElement<any>[] = [
            <FlatButton label="Cancel" primary={true} onClick={this.handleCloseDialog}/>,
            <FlatButton label="Move" primary={true} onClick={this.handleMoveNotes}/>
        ];

        let contentStyle: Object = {
            maxWidth: "300px"
        };

        return (
            <Dialog className="move-notes-dialog" contentStyle={contentStyle} title="Move to folder"
                    actions={dialogActions} modal={true} open={this.state.isDialogShown}
                    onRequestClose={this.handleCloseDialog}>
                <SelectField floatingLabelText="Select option" errorText={this.state.errorText}
                             value={this.state.folder} onChange={this.handleSelectChange}>
                    <MenuItem key="no-folder" value={FolderUtil.NO_FOLDER} primaryText="No folder"/>
                    {this.renderFolderOptions()}
                </SelectField>
            </Dialog>
        );
    }

    private renderFolderOptions(): React.ReactElement<any>[] {
        return _.map(this.props.folders, (folder: string): React.ReactElement<any> =>
            <MenuItem key={folder} value={folder} primaryText={folder}/>
        );
    }

    private handleSelectChange = (event: any, index: number, value: string): void => {
        this.setState({
            folder: value,
            errorText: null
        });
    };

    private handleMoveNotes = (): void => {
        let commonFolder = this.getCommonFolder(this.props);

        if (_.isNil(this.state.folder)) {
            this.setState({
                errorText: MoveNotesDialog.SELECT_OPTION
            });
        } else if (this.state.folder === commonFolder) {
            this.setState({
                errorText: MoveNotesDialog.SELECT_DIFFERENT_FOLDER
            });
        } else {
            let notesToMove: INote[] = this.getNotesToMove(this.props);
            this.props.dispatch(moveNotesTo(notesToMove, this.state.folder));

            this.hideDialog();
            this.showFeedbackMessage(notesToMove);
            this.resetSelectedNotes();
        }
    };

    private handleCloseDialog = (): void => {
        this.hideDialog();
    };

    private showDialog(): void {
        this.setState({
            isDialogShown: true
        });
    }

    private hideDialog(): void {
        this.setState({
            isDialogShown: false
        });
    }

    private resetSelectedNotes(): void {
        if (this.isEditPage(this.props) === false) {
            this.props.dispatch(setSelectedNotes([]));
        }
    }

    private showFeedbackMessage(notesToMove: INote[]): void {
        let message: string;
        let folder: string = this.state.folder !== FolderUtil.NO_FOLDER ? this.state.folder : "No folder";

        if (notesToMove.length === 1) {
            message = `Moved note '${notesToMove[0].title}' to folder '${folder}'`;
        } else {
            message = `Moved ${notesToMove.length} notes to folder '${folder}'`;
        }

        this.props.dispatch(showSnackbarMessage(message));
    }

    private getCommonFolder(props: IMoveNotesDialogProps): string {
        let notes: INote[] = this.getNotesToMove(props);
        let folder: string = null;

        _.some(notes, (note: INote): boolean => {
            let noteFolder: string = FolderUtil.getFolder(note);

            if (folder === null) {
                folder = noteFolder;
            } else if (folder !== noteFolder) {
                folder = null;
                return true;
            }
        });

        return folder;
    }

    private getNotesToMove(props: IMoveNotesDialogProps): INote[] {
        if (this.isEditPage(props)) {
            let noteId: string = props.params.noteId;
            let editedNote: INote = _.find(props.notes, (note: INote): boolean => note.id === noteId);

            if (_.isNil(editedNote) === false) {
                return [editedNote];
            }

            return [];
        }

        return props.selectedNotes;
    }

    private isEditPage(props: IMoveNotesDialogProps): boolean {
        let path: string = props.location.pathname.toString();

        return path.indexOf("edit-note") !== -1;
    }
}

interface IMoveNotesDialogProps {
    dispatch?: IDispatchFunction;
    showMoveNotesDialog?: Object;
    selectedNotes?: INote[];
    selectedFolder?: string;
    folders?: string[];
    notes?: INote[];
    location?: Location;
    params?: any;
}

interface IMoveNotesDialogState {
    isDialogShown?: boolean;
    folder?: string;
    errorText?: string;
}

export default connect((store: IStore, props: IMoveNotesDialogProps): IMoveNotesDialogProps => ({
    showMoveNotesDialog: store.ui.showMoveNotesDialog,
    selectedFolder: store.ui.selectedFolder,
    selectedNotes: store.ui.selectedNotes,
    folders: store.local.folders,
    notes: store.local.notes,
    location: props.location,
    params: props.params
}))(MoveNotesDialog);
