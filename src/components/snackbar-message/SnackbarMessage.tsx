import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {Snackbar} from "material-ui";

import {IStore, ISnackbar} from "../../model/store";

class SnackbarMessage extends React.Component<ISnackbarMessageProps, ISnackbarMessageState> {
    private SNACKBAR_TIMEOUT: number = 2000;

    constructor(props: ISnackbarMessageProps) {
        super(props);

        this.state = {
            snackbarMessage: "",
            isSnackbarOpen: false
        };
    }

    public componentWillReceiveProps(nextProps: ISnackbarMessageProps): void {
        if (this.props.snackbar !== nextProps.snackbar && _.isNil(nextProps.snackbar) === false) {
            this.showSnackbarMessage(nextProps.snackbar.message);
        }
    }

    public render(): React.ReactElement<any> {
        return (
            <Snackbar className="snackbar-message" open={this.state.isSnackbarOpen} message={this.state.snackbarMessage}
                      autoHideDuration={this.SNACKBAR_TIMEOUT} onRequestClose={this.handleSnackbarClose}/>
        );
    }

    private handleSnackbarClose = () => {
        this.hideSnackbar();
    };

    private showSnackbarMessage(snackbarMessage: string): void {
        this.setState({
            isSnackbarOpen: true,
            snackbarMessage
        });
    }

    private hideSnackbar(): void {
        this.setState({
            isSnackbarOpen: false
        });
    }
}

interface ISnackbarMessageProps {
    snackbar?: ISnackbar;
}

interface ISnackbarMessageState {
    snackbarMessage?: string;
    isSnackbarOpen?: boolean;
}

export default connect((state: IStore): ISnackbarMessageProps => ({
    snackbar: state.ui.snackbar
}))(SnackbarMessage);
