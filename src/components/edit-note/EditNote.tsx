import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {InjectedRouter, withRouter} from "react-router";
import {Editor, Plain} from "slate";

import {IStore, INote} from "../../model/store";

import {IDispatchFunction} from "../../utils/ActionUtil";
import IdUtil from "../../utils/IdUtil";

import EditToolbar from "./EditToolbar";

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
            });
        }

        if (this.props.deleteConfirmationId !== nextProps.deleteConfirmationId && _.isNil(this.props.note) === false) {
            let deleteConfirmationId = IdUtil.getNodeListId([this.props.note]);

            if (nextProps.deleteConfirmationId === deleteConfirmationId) {
                this.navigateBack();
            }
        }
    }

    private getEditorState(note: INote): any {
        return Plain.deserialize("");
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="edit-note">
                <EditToolbar toggleInlineStyle={this.handleToolbar} toggleBlockStyle={this.handleToolbar}
                             exportToHtml={this.handleToolbar}/>
                <Editor state={this.state.editorState} onChange={this.handleChange}/>
            </div>
        );
    }

    private handleChange = (editorState): void => {
        this.setState({editorState});
    }

    private handleToolbar = (): void => {
        console.log("handle toolbar");
    }

    private navigateBack(): void {
        this.props.router.goBack();
    }
}

interface IEditNoteState {
    editorState?: any;
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
