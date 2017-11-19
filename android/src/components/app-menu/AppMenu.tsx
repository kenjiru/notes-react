import * as _ from "lodash";
import * as React from "react";
import { ReactElement } from "react";
import { connect } from "react-redux";
import { Location } from "history";
import { IconButton, Menu, MenuItem } from "material-ui";
import MoreVertIcon from "material-ui-icons/MoreVert";

import { IStore, IUser, INote } from "notes-react-core/src/model/store";
import { startSync } from "notes-react-core/src/model/actions/dropbox";
import { showMoveNotesDialog, showAboutDialog, confirmDeletion } from "notes-react-core/src/model/actions/ui";

import DropboxMenuItem from "../dropbox-menu-item/DropboxMenuItem";

class AppMenu extends React.Component<IAppMenuProps, IAppMenuState> {
    public state: IAppMenuState = {
        menuAnchorEl: null
    };

    public componentWillReceiveProps(nextProps: IAppMenuProps): void {
        if (this.props.user !== nextProps.user && _.isNil(nextProps.user) === false) {
            this.props.dispatch(startSync());
        }
    }

    public render(): React.ReactElement<any> {
        const isMenuOpen: boolean = _.isNil(this.state.menuAnchorEl) === false;

        return (
            <div className="app-menu">
                <IconButton aria-label="More" onClick={this.handleMenuClick}>
                    <MoreVertIcon/>
                </IconButton>
                <Menu
                    open={isMenuOpen}
                    anchorEl={this.state.menuAnchorEl}
                    onRequestClose={this.handleRequestClose}
                >
                    <DropboxMenuItem closeMenu={this.closeMenu}/>
                    {this.renderSynchronizeNotes()}
                    {this.renderDeleteNote()}
                    {this.renderMoveNotes()}
                    <MenuItem onClick={this.handleAbout}>About</MenuItem>
                </Menu>
            </div>
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

    private handleMenuClick = (ev: any): void => {
        this.setState({
            menuAnchorEl: ev.currentTarget
        });
    };

    private handleRequestClose = (): void => {
        this.closeMenu();
    };

    private handleMoveNotes = (): void => {
        this.props.dispatch(showMoveNotesDialog());
        this.closeMenu();
    };

    private handleSynchronize = (): void => {
        this.props.dispatch(startSync());
        this.closeMenu();
    };

    private handleDeleteNote = (): void => {
        this.deleteCurrentNote();
        this.closeMenu();
    };

    private handleAbout = (): void => {
        this.props.dispatch(showAboutDialog());
        this.closeMenu();
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

    private closeMenu = (): void => {
        this.setState({
            menuAnchorEl: null
        });
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
    menuAnchorEl?: HTMLElement;
}

export default connect((store: IStore, props: IAppMenuProps): IAppMenuProps => ({
    user: store.dropbox.accessToken && store.dropbox.user ? store.dropbox.user : null,
    notes: store.local.notes,
    selectedNotes: store.ui.selectedNotes,
    location: props.location
}))(AppMenu);
