import * as React from "react";
import {connect} from "react-redux";
import {Dialog, FlatButton} from "material-ui";
import NoteAdd from "material-ui/svg-icons/action/note-add";

import {IStore} from "../../model/store";

import "./AboutDialog.less";

class AboutDialog extends React.Component<IAboutDialogProps, IAboutDialogState> {
    constructor(props: IAboutDialogProps) {
        super(props);

        this.state = {
            isDialogShown: false
        };
    }

    public componentWillReceiveProps(nextProps: IAboutDialogProps): void {
        if (this.props.showAboutDialog !== nextProps.showAboutDialog && _.isNil(nextProps.showAboutDialog) === false) {
            this.showDialog();
        }
    }

    public render(): React.ReactElement<any> {
        let dialogActions: React.ReactElement<any>[] = [
            <FlatButton label="Ok" primary={true} onClick={this.handleCloseDialog}/>,
        ];

        let contentStyle: Object = {
            maxWidth: "400px",
            textAlign: "center"
        };

        let version: string = "0.1.0";

        return (
            <Dialog className="about-dialog" contentStyle={contentStyle} title="About" modal={true}
                    actions={dialogActions} open={this.state.isDialogShown} onRequestClose={this.handleCloseDialog}>
                <div className="dialog-content">
                    <p className="title">Notes</p>
                    <p><a href="http://github.com/kenjiru/notes">http://github.com/kenjiru/notes</a></p>
                    <p>Version {version}</p>
                    <p>Copyright 2016 Kenjiru</p>
                </div>
            </Dialog>
        );
    }

    private handleCloseDialog = (): void => {
        this.hideDialog();
    };

    private showDialog(): void {
        this.setState({
            isDialogShown: true
        });
    }

    private hideDialog(): void {
        this.setState({
            isDialogShown: false
        });
    }
}

interface IAboutDialogProps {
    showAboutDialog?: Object;
}

interface IAboutDialogState {
    isDialogShown?: boolean;
}

export default connect((state: IStore): IAboutDialogProps => ({
    showAboutDialog: state.ui.showAboutDialog
}))(AboutDialog);
