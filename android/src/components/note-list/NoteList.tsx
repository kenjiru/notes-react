import * as _ from "lodash";
import * as React from "react";
import { ReactElement, EventHandler } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as moment from "moment";
import { Toolbar, TextField, Checkbox } from "material-ui";
import Table, {
    TableHead, TableBody, TableFooter, TableRow, TableCell
} from "material-ui/Table";

import { INote, IStore } from "notes-react-core/src/model/store";
import { showSnackbarMessage, confirmDeletion, setSelectedNotes } from "notes-react-core/src/model/actions/ui";
import { createNewNote } from "notes-react-core/src/model/actions/local";

import NoteUtil from "notes-react-core/src/utils/NoteUtil";
import { IDispatchFunction } from "notes-react-core/src/utils/ActionUtil";
import IdUtil from "notes-react-core/src/utils/IdUtil";
import FolderUtil from "notes-react-core/src/utils/FolderUtil";
import MomentUtil from "notes-react-core/src/utils/MomentUtil";

import ActionButton from "../action-button/ActionButton";

import "./NoteList.less";

class NoteList extends React.Component<IListNotesProps, IListNotesState> {
    constructor(props: IListNotesProps) {
        super(props);

        this.state = {
            filter: ""
        };
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="note-list">
                <Toolbar>
                    <TextField className="filter-input" onChange={this.handleFilterChange}/>
                </Toolbar>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={this.areSomeNotesSelected()}
                                    checked={this.areAllNotesSelected()}
                                    onChange={this.handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Last Changed</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.renderNotesRows()}
                    </TableBody>
                    {this.renderNoItems()}
                </Table>

                <ActionButton isDelete={this.hasSelectedItem()} onDelete={this.handleDeleteClick}
                              onAdd={this.handleAddNote}/>
            </div>
        );
    }

    private renderNotesRows(): ReactElement<any>[] {
        let filteredNotes: INote[] = this.getFilteredNotes();

        return _.map(filteredNotes, (note: INote, i: number) =>
            <TableRow key={i}>
                <TableCell padding="checkbox">
                    <Checkbox
                        checked={this.isRowSelected(note.id)}
                        onChange={(ev, checked: boolean) => this.handleCheckboxChange(ev, checked, note)}
                    />
                </TableCell>
                <TableCell style={{cursor: "pointer"}} onClick={(ev) => this.handleTableRowClick(ev, note.id)}>
                    {note.title}
                </TableCell>
                <TableCell>
                    {this.renderLastChanged(note.lastChanged)}
                </TableCell>
            </TableRow>
        );
    }

    private renderLastChanged(lastChanged: string): string {
        let lastChangedDuration: moment.Duration = MomentUtil.getDuration(lastChanged);

        if (lastChangedDuration.asDays() > -7) {
            return lastChangedDuration.humanize(true);
        }

        return MomentUtil.formatAsDateTime(lastChanged);
    }

    private renderNoItems(): ReactElement<any> {
        if (this.getFilteredNotes().length > 0) {
            return;
        }

        return (
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={2} style={{textAlign: 'center'}}>
                        {this.getNoItemsMessage()}
                    </TableCell>
                </TableRow>
            </TableFooter>
        );
    }

    private getNoItemsMessage(): string {
        if (_.isNil(this.state.filter) || _.isEmpty(this.state.filter)) {
            let selectedFolder: string = this.props.selectedFolder;

            if (_.isNil(selectedFolder) || selectedFolder === FolderUtil.NO_FOLDER ||
                selectedFolder === FolderUtil.ALL_NOTES) {

                return "There are no notes";
            }

            return "There are no notes in the current folder.";
        }

        return "No items satisfy the filter criteria.";
    }

    private getFilteredNotes(): INote[] {
        return _.filter(this.props.notes, (note: INote): boolean => {
            let noteText: string = NoteUtil.getText(note);

            if (this.isInSelectedFolder(note) === false || NoteUtil.isTemplateNote(note)) {
                return false;
            }

            return noteText.indexOf(this.state.filter) > -1;
        });
    }

    private isInSelectedFolder(note: INote): boolean {
        let selectedFolder: string = this.props.selectedFolder;

        if (selectedFolder === FolderUtil.ALL_NOTES) {
            return true;
        }

        return FolderUtil.getFolder(note) === selectedFolder;
    }

    private handleTableRowClick = (ev: any, noteId: string) => {
        // if (columnId !== 0) {
        //     return;
        // }

        this.editNote(noteId);
    };

    private handleCheckboxChange = (ev: any, checked: boolean, selectedNote: INote) => {
        let selectedNotes: INote[] = _.clone(this.props.selectedNotes);

        if (checked) {
            selectedNotes.push(selectedNote);
        } else {
            _.remove(selectedNotes, (note: INote): boolean => note.id === selectedNote.id);
        }

        this.props.dispatch(setSelectedNotes(selectedNotes));
    }

    private handleFilterChange: EventHandler<any> = (ev: any): void => {
        this.setState({
            filter: ev.target.value
        });
    };

    private handleDeleteClick = () => {
        this.props.dispatch(confirmDeletion(this.props.selectedNotes));
    };

    private handleAddNote = () => {
        let newNoteId: string = IdUtil.newId();

        this.props.dispatch(createNewNote(newNoteId));
        this.props.dispatch(showSnackbarMessage("New note created!"));

        this.editNote(newNoteId);
    };

    private handleSelectAll = (event: any, checked: boolean): void => {
        let selectedNotes: INote[] = [];

        if (checked) {
            selectedNotes = this.getFilteredNotes();
        }

        this.props.dispatch(setSelectedNotes(selectedNotes));
    }

    private handleRowSelection = (selectedRows: string | number[]): void => {
        let selectedNotes: INote[] = this.getSelectedNotes(selectedRows);

        this.props.dispatch(setSelectedNotes(selectedNotes));
    };

    private areSomeNotesSelected(): boolean {
        let visibleNotes: INote[] = this.getFilteredNotes();
        let selectedNotes: INote[] = this.props.selectedNotes;

        return selectedNotes.length > 0 && selectedNotes.length < visibleNotes.length;
    }

    private areAllNotesSelected(): boolean {
        let visibleNotes: INote[] = this.getFilteredNotes();

        return visibleNotes.length === this.props.selectedNotes.length;
    }

    private isRowSelected(noteId: string): boolean {
        return _.some(this.props.selectedNotes, (note: INote): boolean => note.id === noteId);
    }

    private getSelectedNotes(selectedRows: string | number[]): INote[] {
        let visibleNotes: INote[] = this.getFilteredNotes();

        if (typeof selectedRows !== "string") {
            return _.map(selectedRows, (rowIndex: number): INote => visibleNotes[rowIndex]);
        }
    }

    private hasSelectedItem(): boolean {
        return this.props.selectedNotes.length > 0;
    }

    private editNote(noteId: string): void {
        this.props.router.push(`/edit-note/${noteId}`);
    }
}

interface IListNotesProps {
    dispatch?: IDispatchFunction;
    notes?: INote[];
    deleteConfirmationId?: string;
    selectedNotes?: INote[];
    selectedFolder?: string;
    router?: any;
}

interface IListNotesState {
    filter?: string;
}

export default connect((state: IStore, props: IListNotesProps): IListNotesProps => ({
    notes: state.local.notes,
    deleteConfirmationId: state.ui.deleteConfirmationId,
    selectedNotes: state.ui.selectedNotes,
    selectedFolder: state.ui.selectedFolder,
    router: props.router
}))(withRouter(NoteList));
