import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {InjectedRouter, withRouter} from "react-router";

import {IStore, INote} from "../../model/store";
import {updateNote} from "../../model/actions/local";

import {IDispatchFunction} from "../../utils/ActionUtil";
import IdUtil from "../../utils/IdUtil";
import NoteUtil from "../../utils/NoteUtil";

import SlateEditor from "../slate-editor/SlateEditor";

import EditToolbar from "./EditToolbar";

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
                <EditToolbar toggleInlineStyle={this.handleToolbar} toggleBlockStyle={this.handleToolbar}
                             exportToHtml={this.handleToolbar}/>
                <SlateEditor note={this.props.note} onChange={this.handleNoteChanged}/>
            </div>
        );
    }

    private handleToolbar = (): void => {
        console.log("handle toolbar");
    }

    private handleNoteChanged = (noteContent: string): void => {
        // this.updateNote(noteContent);
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
