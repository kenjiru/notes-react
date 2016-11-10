import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {InjectedRouter, withRouter} from "react-router";
import * as moment from "moment";
import {Editor, EditorState, ContentState, RichUtils} from "draft-js";
import {stateFromHTML} from "draft-js-import-html";

import {IStore, INote} from "../../model/store";
import {updateNote} from "../../model/actions";

import NoteUtil from "../../utils/NoteUtil";
import EditorUtil from "../../utils/EditorUtil";
import {IDispatchFunction} from "../../utils/ActionUtil";
import IdUtil from "../../utils/IdUtil";

import EditToolbar from "./EditToolbar";

class EditNote extends React.Component<IEditNoteProps, IEditNoteState> {
    private styleMap: Object = {
        "STRIKETHROUGH": {
            textDecoration: "line-through",
        },
        "HIGHLIGHT": {
            backgroundColor: "yellow"
        }
    };

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
            });
        }

        if (this.props.deleteConfirmationId !== nextProps.deleteConfirmationId && _.isNil(this.props.note) === false) {
            let deleteConfirmationId = IdUtil.getNodeListId([this.props.note]);

            if (nextProps.deleteConfirmationId === deleteConfirmationId) {
                this.navigateBack();
            }
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
                <EditToolbar toggleInlineStyle={this.toggleInlineStyle} toggleBlockStyle={this.toggleBlockStyle}
                             exportToHtml={this.exportToHtml}/>
                <Editor customStyleMap={this.styleMap} editorState={this.state.editorState}
                        onChange={this.handleChange} onTab={this.handleTab} handleKeyCommand={this.handleKeyCommand}/>
            </div>
        );
    }

    private exportToHtml = (): void => {
        let html: string = EditorUtil.convertToHtml(this.state.editorState.getCurrentContent());

        console.log(html);
    };

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

        if (this.didContentChange(editorState)) {
            this.updateNote(editorState.getCurrentContent());
        }
    }

    private updateNote(contentState: ContentState): void {
        let content: string = EditorUtil.convertToHtml(contentState);

        let updatedNote: INote = _.merge({}, this.props.note, {
            content,
            title: NoteUtil.getTitle(content),
            lastChanged: moment().format(),
            rev: NoteUtil.CHANGED_LOCALLY_REVISION
        });

        this.props.dispatch(updateNote(updatedNote));
    }

    private didContentChange(editorState: EditorState): boolean {
        return this.state.editorState.getCurrentContent() !== editorState.getCurrentContent();
    }

    private navigateBack(): void {
        console.log("navigate back!");
        this.props.router.goBack();
    }
}

interface IEditNoteProps {
    dispatch?: IDispatchFunction;
    params?: {
        noteId: string;
    };
    router?: InjectedRouter;
    note?: INote;
    deleteConfirmationId?: string;
}

interface IEditNoteState {
    editorState?: EditorState;
}

export default connect((state: IStore, props: IEditNoteProps): IEditNoteProps => ({
    note: _.find(state.local.notes, {id: props.params.noteId}),
    router: props.router,
    deleteConfirmationId: state.ui.deleteConfirmationId
}))(withRouter(EditNote));
