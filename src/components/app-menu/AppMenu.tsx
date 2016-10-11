import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {IconButton, IconMenu, MenuItem} from "material-ui";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";

import {IStore, IUser} from "../../model/store";
import {loadNotes} from "../../model/actions";
import DropboxAuth from "../dropbox-auth/DropboxAuth";

class AppMenu extends React.Component<IAppMenuProps, IAppMenuState> {
    public componentWillReceiveProps(nextProps: IAppMenuProps): void {
        if (this.props.user !== nextProps.user && _.isNil(nextProps.user) === false) {
            this.props.dispatch(loadNotes());
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
                <MenuItem primaryText="About"/>
            </IconMenu>
        );
    }

    private renderReloadNotes(): React.ReactElement<any> {
        if (this.isLoggedIn()) {
            return <MenuItem primaryText="Reload notes" onClick={this.handleReload}/>
        }
    }

    handleReload = (): void => {
        this.props.dispatch(loadNotes());
    };

    private isLoggedIn(): boolean {
        return _.isNil(this.props.user) === false;
    }
}

interface IAppMenuProps {
    dispatch?: Function;
    user?: IUser;
}

interface IAppMenuState {
}

export default connect((store: IStore): IAppMenuProps => ({
    user: store.accessToken && store.user ? store.user : null
}))(AppMenu);
