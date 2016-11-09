import * as React from "react";
import {connect} from "react-redux";
import {Dialog, FlatButton, TextField} from "material-ui";

import {IStore} from "../../model/store";

class CreateFolderDialog extends React.Component<ICreateFolderDialogProps, ICreateFolderDialogState> {
    constructor(props: ICreateFolderDialogProps) {
        super(props);

        this.state = {
            isDialogShown: false
        };
    }

    public componentWillReceiveProps(nextProps: ICreateFolderDialogProps): void {
        if (this.props.showCreateFolderDialog !== nextProps.showCreateFolderDialog &&
            _.isNil(nextProps.showCreateFolderDialog) === false) {
            this.showDialog();
        }
    }

    public render(): React.ReactElement<any> {
        let dialogActions: React.ReactElement<any>[] = [
            <FlatButton label="Cancel" primary={true} onClick={this.handleCloseDialog}/>,
            <FlatButton label="Create" primary={true} onClick={this.handleCreateFolder}/>
        ];

        let contentStyle: Object = {
            maxWidth: "300px"
        };

        return (
            <Dialog contentStyle={contentStyle} title="Create new folder" actions={dialogActions} modal={true}
                    open={this.state.isDialogShown} onRequestClose={this.handleCloseDialog}>
                <TextField hintText="Folder name"/>
            </Dialog>
        );
    }

    private handleCreateFolder = (): void => {
        console.log("handleCreateFolder");
    };

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

interface ICreateFolderDialogProps {
    showCreateFolderDialog?: Object;
}

interface ICreateFolderDialogState {
    isDialogShown?: boolean;
}

export default connect((store: IStore): ICreateFolderDialogProps => ({
    showCreateFolderDialog: store.ui.showCreateFolderDialog
}))(CreateFolderDialog);
