import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {Toolbar, ToolbarGroup, IconButton} from "material-ui";
import {Editor, EditorState, ContentState, RichUtils} from "draft-js";
import {stateFromHTML} from "draft-js-import-html";

import {IStore, INote} from "../../model/store";
import NoteUtil from "../../utils/NoteUtil";

import "./EditNote.less";

class EditNote extends React.Component<IEditNoteProps, IEditNoteState> {
    constructor(props: IEditNoteProps) {
        super(props);

        this.state = {
            editorState: this.getEditorState(props.note)
        };
    }

    public componentWillReceiveProps(nextProps: IEditNoteProps): void {
        if (nextProps.note !== this.props.note) {
            this.setState({
                editorState: this.getEditorState(this.props.note)
            })
        }
    }

    private getEditorState(note: INote): EditorState {
        if (_.isNil(note)) {
            return EditorState.createEmpty();
        }

        let noteContent: string = NoteUtil.convertToHtml(this.props.note.content);
        return EditorState.createWithContent(stateFromHTML(noteContent));
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="edit-note">
                <Toolbar>
                    <ToolbarGroup className="edit-toolbar" firstChild={true}>
                        <IconButton iconClassName="material-icons" tooltip="Bold"
                                    onClick={() => this.toggleInlineStyle("BOLD")}>format_bold</IconButton>
                        <IconButton iconClassName="material-icons" tooltip="Italic"
                                    onClick={() => this.toggleInlineStyle("ITALIC")}>format_italic</IconButton>
                        <IconButton iconClassName="material-icons" tooltip="Strike through"
                                    onClick={() => this.toggleInlineStyle("STRIKE")}>format_strikethrough</IconButton>
                        <IconButton iconClassName="material-icons" tooltip="Highlight"
                                    onClick={() => this.toggleInlineStyle("STRIKE")}>highlight</IconButton>
                        <IconButton iconClassName="material-icons" tooltip="Fixed width"
                                    onClick={() => this.toggleInlineStyle("CODE")}>title</IconButton>

                        <IconButton iconClassName="material-icons" tooltip="Unordered list"
                                    onClick={() => this.toggleBlockStyle("unordered-list-item")}>format_list_bulleted
                        </IconButton>
                        <IconButton iconClassName="material-icons" tooltip="Ordered list"
                                    onClick={() => this.toggleBlockStyle("ordered-list-item")}>format_list_numbered
                        </IconButton>

                        <IconButton iconClassName="material-icons"
                                    tooltip="List indent">format_indent_increase</IconButton>
                        <IconButton iconClassName="material-icons"
                                    tooltip="List outdent">format_indent_decrease</IconButton>
                    </ToolbarGroup>
                </Toolbar>
                <Editor editorState={this.state.editorState} onChange={this.handleChange} onTab={this.handleTab}
                        handleKeyCommand={this.handleKeyCommand}/>
            </div>
        );
    }

    private toggleInlineStyle = (style: string): void => {
        const newState: EditorState = RichUtils.toggleInlineStyle(this.state.editorState, style);
        this.updateState(newState);
    };

    private toggleBlockStyle = (style: string): void => {
        const newState: EditorState = RichUtils.toggleBlockType(this.state.editorState, style);
        this.updateState(newState);
    };

    private handleKeyCommand = (command: string): boolean => {
        const newState: EditorState = RichUtils.handleKeyCommand(this.state.editorState, command);

        if (newState) {
            this.updateState(newState);
            return true;
        }

        return false;
    };

    private handleChange = (editorState: EditorState): void => {
        this.updateState(editorState);
    };

    private handleTab = (ev: React.KeyboardEvent<{}>): void => {
        const newState: EditorState = RichUtils.onTab(ev, this.state.editorState, 2);

        this.updateState(newState);
    };

    private updateState(editorState: EditorState): void {
        this.setState({
            editorState
        });
    }
}

interface IEditNoteProps {
    params?: {
        noteId: string;
    };
    note?: INote;
}

interface IEditNoteState {
    editorState?: EditorState;
}

export default connect((state: IStore, props: IEditNoteProps): IEditNoteProps => ({
    note: _.find(state.notes, {id: props.params.noteId})
}))(EditNote);
