import * as _ from "lodash";
import * as React from "react";
import { ReactElement } from "react";
import { connect } from "react-redux";
import { Editor } from "slate-react";
import Html from "slate-html-serializer";
import Plain from "slate-plain-serializer";

import NoteUtil from "../../utils/NoteUtil";
import { IDispatchFunction } from "../../utils/ActionUtil";
import { INote, IStore } from "../../model/store";
import { setEditorState } from "../../model/actions/editorState";

import rules from "./serialize/html-rules";
import TomboySerializer from "./serialize/TomboySerializer";

import plugins from "./plugins";

import "./SlateEditor.less";

const html = new Html({rules});

class SlateEditor extends React.Component<ISlateEditorProps> {
    constructor(props: ISlateEditorProps) {
        super(props);

        this.setEditorNote(props.note);
    }

    public componentWillReceiveProps(nextProps: ISlateEditorProps): void {
        if (nextProps.note !== this.props.note && _.isEmpty(nextProps.note) === false) {
            this.setEditorNote(nextProps.note);
        }
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="slate-editor">
                <Editor
                    className="editor"
                    plugins={plugins}
                    value={this.props.editorState}
                    onChange={this.handleChange}
                    onDocumentChange={this.handleDocumentChange}
                    renderNode={this.renderNode}
                    renderMark={this.renderMark}
                />
            </div>
        );
    }

    renderNode = (props: any): ReactElement<any> => {
        switch (props.node.type) {
            case "header":
                return <h1 {...props.attributes}>{props.children}</h1>;
            case "paragraph":
                return <p {...props.attributes}>{props.children}</p>;
            case "bulleted-list":
                return <ul {...props.attributes}>{props.children}</ul>;
            case "list-item":
                return <li {...props.attributes}>{props.children}</li>;

        }
    }

    renderMark = (props: any): ReactElement<any> => {
        switch (props.mark.type) {
            case "bold":
                return <b>{props.children}</b>;
            case "italic":
                return <i>{props.children}</i>;
            case "strikethrough":
                return <del>{props.children}</del>;
            case "highlight":
                return <span style={{background: "yellow"}}>{props.children}</span>;
            case "fixed":
                return <span style={{fontFamily: "monospace"}}>{props.children}</span>;
            case "small":
                return <span style={{fontSize: "small"}}>{props.children}</span>;
            case "large":
                return <span style={{fontSize: "large"}}>{props.children}</span>;
            case "xxlarge":
                return <span style={{fontSize: "xx-large"}}>{props.children}</span>;
        }
    }

    private handleDocumentChange = (document: any, state: any): void => {
        const tomboyFormat: string = TomboySerializer.serialize(state);

        this.props.onDocumentChange(tomboyFormat);
    }

    private handleChange = ({value}): void => {
        this.props.dispatch(setEditorState(value));
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
