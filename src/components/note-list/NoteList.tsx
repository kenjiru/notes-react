import * as _ from "lodash";
import * as React from "react";
import {ReactElement} from "react";
import {Dialog, FlatButton} from "material-ui";
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn} from "material-ui/Table"

class NoteList extends React.Component<IListNotesProps, IListNotesState> {
    private notes: INoteModel[] = [{
        name: "Network configuration",
        lastChanged: new Date()
    }, {
        name: "Application passwords",
        lastChanged: new Date()
    }, {
        name: "Deployment process",
        lastChanged: new Date()
    }, {
        name: "Code guidelines",
        lastChanged: new Date()
    }];

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
        let actions: ReactElement<any>[] = [
            <FlatButton label="Cancel" primary={true} onTouchTap={this.handleNoteDialogClose}/>,
        ];

        return (
            <Dialog title={this.getSelectedNote()} actions={actions} modal={false}
                    open={this.state.isNoteDialogVisible}
                    onRequestClose={this.handleNoteDialogClose}>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet ligula in nunc
                lectus. Sed eu mi maximus, finibus lectus ut, vulputate urna. Vivamus sollicitudin
                lobortis dictum.</p>
            </Dialog>
        );
    }

    private renderNotesRows(): ReactElement<any>[] {
        return _.map(this.notes, (note: INoteModel, i: number) =>
            <TableRow key={i}>
                <TableRowColumn>{note.name}</TableRowColumn>
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

    private getSelectedNote(): string {
        if (_.isNil(this.state.selectedNote)) {
            return "No note selected!";
        }

        return this.notes[this.state.selectedNote].name;
    }
}

interface INoteModel {
    name: string;
    lastChanged: Date;
}

interface IListNotesProps {}

interface IListNotesState {
    isDrawerVisible?: boolean;
    isNoteDialogVisible?: boolean;
    selectedNote?: number;
    selectedFolder?: number;
    clickedNote?: number;
}

export default NoteList;
