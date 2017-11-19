import * as _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import {Editor, Plain, Html} from "slate";

import NoteUtil from "../../utils/NoteUtil";
import { IDispatchFunction } from "../../utils/ActionUtil";
import { INote, IStore } from "../../model/store";
import { setEditorState } from "../../model/actions/editorState";

import rules from "./serialize/html-rules";
import TomboySerializer from "./serialize/TomboySerializer";

import schema from "./schema";
import plugins from "./plugins";

import "./SlateEditor.less";

const html = new Html({rules});

class SlateEditor extends React.Component<ISlateEditorProps> {
    constructor(props: ISlateEditorProps) {
        super(props);

        this.setEditorNote(props.note);
    }

    public componentWillReceiveProps(nextProps: ISlateEditorProps): void {
        if (nextProps.note !== this.props.note) {
            this.setEditorNote(nextProps.note);
        }
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="slate-editor">
                <Editor className="editor"
                        schema={schema} plugins={plugins}
                        state={this.props.editorState} onChange={this.handleChange}
                        onDocumentChange={this.handleDocumentChange}/>
            </div>
        );
    }

    private handleDocumentChange = (document: any, state: any): void => {
        const tomboyFormat: string = TomboySerializer.serialize(state);

        this.props.onDocumentChange(tomboyFormat);
    }

    private handleChange = (editorState): void => {
        this.props.dispatch(setEditorState(editorState));
    }

    private setEditorNote(note: INote): void {
        const editorState: any = this.getEditorState(note);

        this.props.dispatch(setEditorState(editorState));
    }

    private getEditorState(note: INote): any {
        let noteContent: string = "<p></p>";

        if (_.isNil(note) === false) {
            noteContent = NoteUtil.convertToHtml(this.props.note.content);
        }

        return html.deserialize(noteContent);
    }
}

interface ISlateEditorProps {
    editorState?: any;
    note?: INote;
    onDocumentChange?: (noteContent: string) => void;
    dispatch?: IDispatchFunction;
}

export default connect<any, any, ISlateEditorProps>((state: IStore): ISlateEditorProps => ({
    editorState: state.editorState
}))(SlateEditor);
