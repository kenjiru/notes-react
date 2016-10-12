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
import NoteUtil from "../../utils/NoteUtil";

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
                    <TextField style={{width: "100%"}} hintText="Filter" onChange={this.handleFilterChange}/>
                </Toolbar>

                <Table onCellClick={this.handleTableClick}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Last Changed</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {this.renderNotesRows()}
                    </TableBody>
                    {this.renderNoItems()}
                </Table>
            </div>
        );
    }

    private renderNotesRows(): ReactElement<any>[] {
        let filteredNotes: INote[] = this.getFilteredNotes();

        return _.map(filteredNotes, (note: INote, i: number) =>
            <TableRow key={i}>
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

    handleTableClick = (selectedNote: number, columnId: number) => {
        if (columnId !== 0) {
            return;
        }

        let note: INote = this.props.notes[selectedNote];

        browserHistory.push(`/edit-note/${note.id}`);
    };

    handleFilterChange: EventHandler<any> = (ev: any): void => {
        this.setState({
            filter: ev.target.value
        });
    };
}

interface IListNotesProps {
    notes: INote[];
}

interface IListNotesState {
    filter: string;
}

export default connect((state: IStore) => ({
    notes: state.notes
}))(NoteList);
