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
import {createNewNote, showSnackbarMessage, confirmDeletion} from "../../model/actions";

import NoteUtil from "../../utils/NoteUtil";
import {IDispatchFunction} from "../../utils/ActionUtil";
import IdUtil from "../../utils/IdUtil";
import ActionButton from "../action-button/ActionButton";

import "./NoteList.less";

class NoteList extends React.Component<IListNotesProps, IListNotesState> {
    constructor(props: IListNotesProps) {
        super(props);

        this.state = {
            filter: "",
            selectedRows: []
        };
    }

    public componentWillReceiveProps(nextProps: IListNotesProps): void {
        if (this.props.deleteConfirmationId !== nextProps.deleteConfirmationId) {
            let deleteConfirmationId = IdUtil.getNodeListId(this.getSelectedNotes());

            if (nextProps.deleteConfirmationId === deleteConfirmationId) {
                this.setState({
                    selectedRows: []
                });
            }
        }
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
            <TableRow key={i} selected={this.isRowSelected(i)}>
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
        return _.filter(this.props.notes, (note: INote) => {
            let noteText: string = NoteUtil.getText(note);

            return noteText.indexOf(this.state.filter) > -1;
        });
    }

    private handleTableClick = (selectedNote: number, columnId: number) => {
        if (columnId !== 0) {
            return;
        }

        let note: INote = this.props.notes[selectedNote];
        this.editNote(note.id);
    };

    private handleFilterChange: EventHandler<any> = (ev: any): void => {
        this.setState({
            filter: ev.target.value
        });
    };

    private handleDeleteClick = () => {
        this.props.dispatch(confirmDeletion(this.getSelectedNotes()));
    };

    private handleAddNote = () => {
        let newNoteId: string = IdUtil.newId();

        this.props.dispatch(createNewNote(newNoteId));
        this.props.dispatch(showSnackbarMessage("New note created!"));

        this.editNote(newNoteId);
    };

    private handleRowSelection = (selectedRows: string|number[]): void => {
        this.setState({
            selectedRows
        });
    };

    private isRowSelected(rowIndex: number): boolean {
        let selectedRows: string|number[] = this.state.selectedRows;

        if (_.isNil(selectedRows)) {
            return false;
        }

        if (typeof selectedRows === "string") {
            return selectedRows === "all";
        }

        return selectedRows.indexOf(rowIndex) !== -1;
    }

    private getSelectedNotes(): INote[] {
        let selectedRows: string|number[] = this.state.selectedRows;
        let visibleNotes: INote[] = this.getFilteredNotes();

        if (typeof selectedRows !== "string") {
            return _.map(selectedRows, (rowIndex: number): INote => visibleNotes[rowIndex]);
        }
    }

    private hasSelectedItem(): boolean {
        return this.state.selectedRows.length > 0;
    }

    private editNote(noteId: string): void {
        browserHistory.push(`/edit-note/${noteId}`);
    }
}

interface IListNotesProps {
    notes?: INote[];
    deleteConfirmationId?: string;
    dispatch?: IDispatchFunction;
}

interface IListNotesState {
    filter?: string;
    selectedRows?: string|number[];
}

export default connect((state: IStore): IListNotesProps => ({
    notes: state.local.notes,
    deleteConfirmationId: state.ui.deleteConfirmationId
}))(NoteList);
