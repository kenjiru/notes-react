import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {InjectedRouter, withRouter} from "react-router";

import { IDispatchFunction } from "notes-react-core/src/utils/ActionUtil";
import IdUtil from "notes-react-core/src/utils/IdUtil";
import NoteUtil from "notes-react-core/src/utils/NoteUtil";

import { IStore, INote } from "notes-react-core/src/model/store";
import { updateNote } from "notes-react-core/src/model/actions/local";
import { toggleBlock, toggleMark } from "notes-react-core/src/model/actions/editorState";

import SlateEditor from "notes-react-core/src/components/slate-editor/SlateEditor";
import EditToolbar from "../edit-toolbar/EditToolbar";

class EditNote extends React.Component<IEditNoteProps, IEditNoteState> {
    public componentWillReceiveProps(nextProps: IEditNoteProps): void {
        if (this.props.deleteConfirmationId !== nextProps.deleteConfirmationId && _.isNil(this.props.note) === false) {
            let deleteConfirmationId = IdUtil.getNodeListId([this.props.note]);

            if (nextProps.deleteConfirmationId === deleteConfirmationId) {
                this.navigateBack();
            }
        }
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="edit-note">
                <EditToolbar onToggleMark={this.handleToggleMark} onToggleBlock={this.handleToggleBlock}/>
                <SlateEditor note={this.props.note} onDocumentChange={this.handleNoteChanged}/>
            </div>
        );
    }

    private handleToggleMark = (mark: string): void => {
        this.props.dispatch(toggleMark(mark));
    }

    private handleToggleBlock = (block: string): void => {
        this.props.dispatch(toggleBlock(block));
    }

    private handleNoteChanged = (noteContent: string): void => {
        this.updateNote(noteContent);
    }

    private updateNote(content: string): void {
        let updatedNote: INote = _.merge({}, this.props.note, {
            content,
            title: NoteUtil.getTitle(content),
            lastChanged: moment().format(),
            rev: NoteUtil.CHANGED_LOCALLY_REVISION
        });

        this.props.dispatch(updateNote(updatedNote));
    }

    private navigateBack(): void {
        this.props.router.goBack();
    }
}

interface IEditNoteState {
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

export default connect((state: IStore, props: IEditNoteProps): IEditNoteProps => ({
    note: _.find(state.local.notes, {id: props.params.noteId}),
    router: props.router,
    deleteConfirmationId: state.ui.deleteConfirmationId
}))(withRouter(EditNote));
