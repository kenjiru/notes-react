import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";

import { IStore, INote } from "notes-react-core/src/model/store";
import HtmlChunk from "../html-chunk/HtmlChunk";
import NoteUtil from "notes-react-core/src/utils/NoteUtil";

class ViewNote extends React.Component<IViewNoteProps, IViewNoteState> {
    public render(): React.ReactElement<any> {
        let noteContent: string = NoteUtil.convertToHtml(this.props.note.content);

        return (
            <HtmlChunk className="view-note" html={noteContent}/>
        );
    }
}

interface IViewNoteProps {
    params?: {
        noteId: string;
    };
    note?: INote;
}

interface IViewNoteState {}

export default connect((state: IStore, props: IViewNoteProps) : IViewNoteProps=> ({
    note: _.find(state.local.notes, {id: props.params.noteId})
}))(ViewNote);
