import * as _ from "lodash";
import * as React from "react";
import {ReactElement, EventHandler} from "react";
import {connect} from "react-redux";
import {browserHistory} from "react-router";
import {Toolbar, TextField} from "material-ui";
import {
    Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn, TableFooter
} from "material-ui/Table";

import {INote, IStore} from "../../model/store";
import {createNewNote, showSnackbarMessage, confirmDeletion, setSelectedNotes} from "../../model/actions";

import NoteUtil from "../../utils/NoteUtil";
import {IDispatchFunction} from "../../utils/ActionUtil";
import IdUtil from "../../utils/IdUtil";
import ActionButton from "../action-button/ActionButton";

import "./NoteList.less";
import FolderUtil from "../../utils/FolderUtil";

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
                    <TextField style={{width: "100%"}} hintText="Filter" onChange={this.handleFilterChange}/>
                </Toolbar>

                <Table multiSelectable={true} onCellClick={this.handleTableClick}
                       onRowSelection={this.handleRowSelection}>
                    <TableHeader enableSelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Last Changed</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false}>
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
            <TableRow key={i} selected={this.isRowSelected(note.id)}>
                <TableRowColumn style={{cursor: "pointer"}}>{note.title}</TableRowColumn>
                <TableRowColumn>{note.lastChanged.toString()}</TableRowColumn>
            </TableRow>
        );
    }

    private renderNoItems(): ReactElement<any> {
        if (this.getFilteredNotes().length > 0 || this.props.notes.length === 0) {
            return;
        }

        return (
            <TableFooter>
                <TableRow >
                    <TableRowColumn colSpan={2} style={{textAlign: 'center'}}>
                        No items satisfy the filter criteria.
                    </TableRowColumn>
                </TableRow>
            </TableFooter>
        );
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

    private handleTableClick = (selectedIndex: number, columnId: number) => {
        if (columnId !== 0) {
            return;
        }

        let notes: INote[] = this.getFilteredNotes();
        this.editNote(notes[selectedIndex].id);
    };

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

    private handleRowSelection = (selectedRows: string|number[]): void => {
        let selectedNotes: INote[] = this.getSelectedNotes(selectedRows);
        this.props.dispatch(setSelectedNotes(selectedNotes));
    };

    private isRowSelected(noteId: string): boolean {
        return _.some(this.props.selectedNotes, (note: INote): boolean => note.id === noteId);
    }

    private getSelectedNotes(selectedRows: string|number[]): INote[] {
        let visibleNotes: INote[] = this.getFilteredNotes();

        if (typeof selectedRows !== "string") {
            return _.map(selectedRows, (rowIndex: number): INote => visibleNotes[rowIndex]);
        }
    }

    private hasSelectedItem(): boolean {
        return this.props.selectedNotes.length > 0;
    }

    private editNote(noteId: string): void {
        browserHistory.push(`/edit-note/${noteId}`);
    }
}

interface IListNotesProps {
    dispatch?: IDispatchFunction;
    notes?: INote[];
    deleteConfirmationId?: string;
    selectedNotes?: INote[];
    selectedFolder?: string;
}

interface IListNotesState {
    filter?: string;
}

export default connect((state: IStore): IListNotesProps => ({
    notes: state.local.notes,
    deleteConfirmationId: state.ui.deleteConfirmationId,
    selectedNotes: state.ui.selectedNotes,
    selectedFolder: state.ui.selectedFolder
}))(NoteList);
