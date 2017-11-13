import * as _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { Location } from "history";
import { IconButton, Menu, MenuItem } from "material-ui";
import MoreVertIcon from "material-ui-icons/MoreVert";

import { IStore, IUser, INote } from "../../model/store";
import { startSync } from "../../model/actions/dropbox";
import { showMoveNotesDialog, showAboutDialog, confirmDeletion } from "../../model/actions/ui";

import DropboxAuth from "../dropbox-auth/DropboxAuth";

class AppMenu extends React.Component<IAppMenuProps, IAppMenuState> {
    public componentWillReceiveProps(nextProps: IAppMenuProps): void {
        if (this.props.user !== nextProps.user && _.isNil(nextProps.user) === false) {
            this.props.dispatch(startSync());
        }
    }

    public render(): React.ReactElement<any> {
        return (
            <Menu>
                <DropboxAuth/>
                {this.renderSynchronizeNotes()}
                {this.renderDeleteNote()}
                {this.renderMoveNotes()}
                <MenuItem onClick={this.handleAbout}>About</MenuItem>
            </Menu>
        );
    }

    private renderMoveNotes(): React.ReactElement<any> {
        let selectedNotes: INote[] = this.props.selectedNotes;
        let itemText: string;

        if (selectedNotes.length === 0 && this.isEditPage() === false) {
            return;
        }

        if (this.isEditPage()) {
            itemText = "Move note";
        } else if (selectedNotes.length > 0) {
            itemText = "Move notes";
        }

        return <MenuItem onClick={this.handleMoveNotes}>{itemText}</MenuItem>
    }

    private renderSynchronizeNotes(): React.ReactElement<any> {
        if (this.isLoggedIn()) {
            return <MenuItem onClick={this.handleSynchronize}>Synchronize notes</MenuItem>
        }
    }

    private renderDeleteNote(): React.ReactElement<any> {
        if (this.isEditPage()) {
            return <MenuItem onClick={this.handleDeleteNote}>Delete note</MenuItem>
        }
    }

    private handleMoveNotes = (): void => {
        this.props.dispatch(showMoveNotesDialog());
    };

    private handleSynchronize = (): void => {
        this.props.dispatch(startSync());
    };

    private handleDeleteNote = (): void => {
        this.deleteCurrentNote();
    };

    private handleAbout = (): void => {
        this.props.dispatch(showAboutDialog());
    };

    private deleteCurrentNote(): void {
        let note: INote = this.getCurrentNote();

        this.props.dispatch(confirmDeletion([note]))
    }

    private getCurrentNote(): INote {
        let noteId: string = this.getCurrentNoteId();

        return _.find(this.props.notes, (note: INote): boolean => note.id === noteId);
    }

    private getCurrentNoteId(): string {
        let path: string = this.props.location.pathname.toString();
        let match: string[] = path.match(/\/edit-note\/([^\s]*)[\/]*/);

        if (match) {
            return match[1];
        }
    }

    private isEditPage(): boolean {
        let path: string = this.props.location.pathname.toString();

        return path.indexOf("edit-note") !== -1;
    }

    private isLoggedIn(): boolean {
        return _.isNil(this.props.user) === false;
    }
}

interface IAppMenuProps {
    dispatch?: Function;
    user?: IUser;
    notes?: INote[];
    selectedNotes?: INote[];
    location?: Location;
}

interface IAppMenuState {
}

export default connect((store: IStore, props: IAppMenuProps): IAppMenuProps => ({
    user: store.dropbox.accessToken && store.dropbox.user ? store.dropbox.user : null,
    notes: store.local.notes,
    selectedNotes: store.ui.selectedNotes,
    location: props.location
}))(AppMenu);
