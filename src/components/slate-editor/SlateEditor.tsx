import * as _ from "lodash";
import * as React from "react";
import {Editor, Plain, Html} from "slate";

import NoteUtil from "../../utils/NoteUtil";
import SlateUtil from "../../utils/SlateUtil";
import {INote} from "../../model/store";

import EditToolbar from "../edit-note/EditToolbar";

import rules from "./serialize/html-rules";
import TomboySerializer from "./serialize/TomboySerializer";
import RawSerializer from "./serialize/RawSerializer";

import schema from "./schema";
import plugins from "./plugins";

const html = new Html({rules});

class SlateEditor extends React.Component<ISlateEditorProps, ISlateEditorState> {
    constructor(props: ISlateEditorProps) {
        super(props);

        this.state = {
            editorState: this.getEditorState(props.note)
        };
    }

    public componentWillReceiveProps(nextProps: ISlateEditorProps): void {
        if (nextProps.note !== this.props.note) {
            this.setState({
                editorState: this.getEditorState(this.props.note)
            });
        }
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="slate-editor">
                <EditToolbar onToggleMark={this.handleToggleMark} onToggleBlock={this.handleToggleBlock}
                             onExportToHtml={this.handleExportToHtml}/>
                <Editor className="slate-editor"
                        schema={schema} plugins={plugins}
                        state={this.state.editorState} onChange={this.handleChange}
                        onDocumentChange={this.handleDocumentChange}/>
            </div>
        );
    }

    private handleDocumentChange = (document: any, state: any): void => {
        const tomboyFormat: string = TomboySerializer.serialize(state);

        this.props.onDocumentChange(tomboyFormat);
    }

    private handleChange = (editorState): void => {
        this.setState({editorState});
    }

    private handleToggleMark = (mark: string): void => {
        const editorState = SlateUtil.toggleMark(this.state.editorState, mark);

        this.setState({
            editorState
        });
    }

    private handleToggleBlock = (block: string): void => {
        const editorState = SlateUtil.toggleBlock(this.state.editorState, block);

        this.setState({
            editorState
        });
    }

    private handleExportToHtml = (): void => {
        const tomboyFormat: string = TomboySerializer.serialize(this.state.editorState);
        const rawFormat: any = RawSerializer.serialize(this.state.editorState);

        console.log(rawFormat);
        console.log(tomboyFormat);
    }

    private getEditorState(note: INote): any {
        let noteContent: string = "<p></p>";

        if (_.isNil(note) === false) {
            noteContent = NoteUtil.convertToHtml(this.props.note.content);
        }

        return html.deserialize(noteContent);
    }
}

interface ISlateEditorState {
    editorState?: any;
}

interface ISlateEditorProps {
    note?: INote;
    onDocumentChange?: (noteContent: string) => void;
}

export default SlateEditor;
