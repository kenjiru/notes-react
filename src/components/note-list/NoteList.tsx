import * as _ from "lodash";
import * as React from "react";
import {ReactElement} from "react";
import {connect} from "react-redux";
import {Dialog, FlatButton} from "material-ui";
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn} from "material-ui/Table"

import {INote, IStore} from "../../model/store";
import NoteUtil from "../../utils/NoteUtil";
import HtmlChunk from "../html-chunk/HtmlChunk";

class NoteList extends React.Component<IListNotesProps, IListNotesState> {
    constructor(props: IListNotesProps) {
        super(props);

        this.state = {
            isDrawerVisible: false,
            isNoteDialogVisible: false,
            selectedFolder: 0
        };
    }

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
                {this.renderNoteDialog()}
            </div>
        );
    }

    private renderNoteDialog(): ReactElement<any> {
        let selectedNote: INote = this.getSelectedNote();

        if (_.isNil(selectedNote)) {
            return;
        }

        let noteContent: string = NoteUtil.convertToHtml(selectedNote.content);

        let actions: ReactElement<any>[] = [
            <FlatButton label="Close" primary={true} onTouchTap={this.handleNoteDialogClose}/>,
        ];

        return (
            <Dialog actions={actions} modal={false}
                    open={this.state.isNoteDialogVisible}
                    onRequestClose={this.handleNoteDialogClose}>
                <HtmlChunk className="dialog-content" html={noteContent}/>
            </Dialog>
        );
    }

    private renderNotesRows(): ReactElement<any>[] {
        return _.map(this.props.notes, (note: INote, i: number) =>
            <TableRow key={i}>
                <TableRowColumn>{note.title}</TableRowColumn>
                <TableRowColumn>{note.lastChanged.toString()}</TableRowColumn>
            </TableRow>
        );
    }

    handleTableClick = (selectedNote: number, columnId: number) => {
        this.setState({
            selectedNote,
            isNoteDialogVisible: true
        })
    };

    handleNoteDialogClose = () => {
        this.setState({
            isNoteDialogVisible: false
        });
    };

    private getSelectedNote(): INote {
        if (_.isNil(this.state.selectedNote)) {
            return null;
        }

        return this.props.notes[this.state.selectedNote];
    }
}

interface IListNotesProps {
    notes: INote[];
}

interface IListNotesState {
    isDrawerVisible?: boolean;
    isNoteDialogVisible?: boolean;
    selectedNote?: number;
    selectedFolder?: number;
    clickedNote?: number;
}

export default connect((state: IStore) => ({
    notes: state.notes
}))(NoteList);
