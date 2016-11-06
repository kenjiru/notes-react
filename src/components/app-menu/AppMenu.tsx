import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {InjectedRouter} from "react-router";
import {Location} from "history";
import {IconButton, IconMenu, MenuItem} from "material-ui";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";

import {IStore, IUser, INote} from "../../model/store";
import {startSync, confirmDeletion} from "../../model/actions";
import DropboxAuth from "../dropbox-auth/DropboxAuth";
import IdUtil from "../../utils/IdUtil";

class AppMenu extends React.Component<IAppMenuProps, IAppMenuState> {
    public componentWillReceiveProps(nextProps: IAppMenuProps): void {
        if (this.props.user !== nextProps.user && _.isNil(nextProps.user) === false) {
            this.props.dispatch(startSync());
        }

        if (this.props.deleteConfirmationId !== nextProps.deleteConfirmationId) {
            let currentNotes: INote[] = [this.getCurrentNote()];
            let deleteConfirmationId = IdUtil.getNodeListId(currentNotes);

            if (nextProps.deleteConfirmationId === deleteConfirmationId) {
                this.navigateBack();
            }
        }
    }

    public render(): React.ReactElement<any> {
        return (
            <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                      targetOrigin={{horizontal: "right", vertical: "top"}}
                      anchorOrigin={{horizontal: "right", vertical: "top"}}
                      width={200}>
                <DropboxAuth/>
                {this.renderReloadNotes()}
                {this.renderDeleteNote()}
                <MenuItem primaryText="About"/>
            </IconMenu>
        );
    }

    private renderReloadNotes(): React.ReactElement<any> {
        if (this.isLoggedIn()) {
            return <MenuItem primaryText="Reload notes" onClick={this.handleReload}/>
        }
    }

    private renderDeleteNote(): React.ReactElement<any> {
        if (this.isEditPage()) {
            return <MenuItem primaryText="Delete note" onClick={this.handleDeleteNote}/>
        }
    }

    private handleReload = (): void => {
        this.props.dispatch(startSync());
    };

    private handleDeleteNote = (): void => {
        this.deleteCurrentNote();
    };

    private navigateBack(): void {
        this.props.router.goBack();
    }

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
    deleteConfirmationId?: string;
    router?: InjectedRouter;
    location?: Location;
}

interface IAppMenuState {
}

export default connect((store: IStore, props: IAppMenuProps): IAppMenuProps => ({
    user: store.dropbox.accessToken && store.dropbox.user ? store.dropbox.user : null,
    notes: store.local.notes,
    deleteConfirmationId: store.ui.deleteConfirmationId,
    router: props.router,
    location: props.location
}))(AppMenu);
