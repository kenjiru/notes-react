import * as _ from "lodash";
import * as React from "react";
import {ReactElement} from "react";
import {connect} from "react-redux";
import {browserHistory} from "react-router";
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn} from "material-ui/Table"

import {INote, IStore} from "../../model/store";

class NoteList extends React.Component<IListNotesProps, IListNotesState> {
    public render(): React.ReactElement<any> {
        return (
            <div className="note-list">
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
                </Table>
            </div>
        );
    }

    private renderNotesRows(): ReactElement<any>[] {
        return _.map(this.props.notes, (note: INote, i: number) =>
            <TableRow key={i}>
                <TableRowColumn style={{cursor: "pointer"}}>{note.title}</TableRowColumn>
                <TableRowColumn>{note.lastChanged.toString()}</TableRowColumn>
            </TableRow>
        );
    }

    handleTableClick = (selectedNote: number, columnId: number) => {
        if (columnId !== 0) {
            return;
        }

        let note: INote = this.props.notes[selectedNote];

        browserHistory.push(`/note/${note.id}`);
    };
}

interface IListNotesProps {
    notes: INote[];
}

interface IListNotesState {
}

export default connect((state: IStore) => ({
    notes: state.notes
}))(NoteList);
