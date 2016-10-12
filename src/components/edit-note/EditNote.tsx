import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {Editor, EditorState, ContentState} from "draft-js";
import {stateFromHTML} from "draft-js-import-html";

import {IStore, INote} from "../../model/store";
import NoteUtil from "../../utils/NoteUtil";

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
                <Editor editorState={this.state.editorState} onChange={this.onChange}/>
            </div>
        );
    }

    private onChange = (editorState: EditorState): void => {
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
