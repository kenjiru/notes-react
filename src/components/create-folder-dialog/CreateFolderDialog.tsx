import * as React from "react";
import {connect} from "react-redux";
import {Dialog, FlatButton, TextField} from "material-ui";

import {IStore} from "../../model/store";
import {createFolder} from "../../model/actions";
import {IDispatchFunction} from "../../utils/ActionUtil";

class CreateFolderDialog extends React.Component<ICreateFolderDialogProps, ICreateFolderDialogState> {
    private EMPTY_FOLDER: string = "Folder name cannot be empty";
    private FOLDER_EXISTS: string = "Folder already exists";

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
                <TextField hintText="Folder name" value={this.state.folderName} errorText={this.state.errorText}
                           onChange={this.handleInputChange}/>
            </Dialog>
        );
    }

    private handleInputChange = (ev: any): void => {
        this.setState({
            folderName: ev.target.value,
            errorText: null
        });
    };

    private handleCreateFolder = (): void => {
        if (this.isEmpty()) {
            this.setState({
                errorText: this.EMPTY_FOLDER
            });
        } else if (this.folderAlreadyExists()) {
            this.setState({
                errorText: this.FOLDER_EXISTS
            });
        } else {
            this.hideDialog();
            this.props.dispatch(createFolder(this.state.folderName))
        }
    };

    private handleCloseDialog = (): void => {
        this.hideDialog();
    };

    private showDialog(): void {
        this.setState({
            isDialogShown: true,
            folderName: ""
        });
    }

    private hideDialog(): void {
        this.setState({
            isDialogShown: false
        });
    }

    private folderAlreadyExists(): boolean {
        return _.some(this.props.folders, (folder: string): boolean => folder === this.state.folderName);
    }

    private isEmpty(): boolean {
        return _.isNil(this.state.folderName) || this.state.folderName === "";
    }
}

interface ICreateFolderDialogProps {
    dispatch?: IDispatchFunction;
    showCreateFolderDialog?: Object;
    folders?: string[];
}

interface ICreateFolderDialogState {
    isDialogShown?: boolean;
    folderName?: string;
    errorText?: string;
}

export default connect((store: IStore): ICreateFolderDialogProps => ({
    showCreateFolderDialog: store.ui.showCreateFolderDialog,
    folders: store.local.folders
}))(CreateFolderDialog);
