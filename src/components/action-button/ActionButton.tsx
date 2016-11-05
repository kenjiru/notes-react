import * as React from "react";
import {FloatingActionButton} from "material-ui";
import ContentAdd from "material-ui/svg-icons/content/add";
import ActionDelete from "material-ui/svg-icons/action/delete";

import "./ActionButton.less";

class ActionButton extends React.Component<IActionButtonProps, IActionButtonState> {
    public render(): React.ReactElement<any> {
        return (
            <div className="action-button">
                <FloatingActionButton secondary={this.props.isDelete} mini={true} onClick={this.handleClick}>
                    {this.renderIcon()}
                </FloatingActionButton>
            </div>
        );
    }

    private renderIcon(): React.ReactElement<any> {
        if (this.props.isDelete) {
            return <ActionDelete/>;
        }

        return <ContentAdd/>
    }

    private handleClick = () => {
        if (this.props.isDelete) {
            this.props.onDelete();
        } else {
            this.props.onAdd();
        }
    };
}

interface IActionButtonProps {
    isDelete: boolean;
    onDelete: () => void;
    onAdd: () => void;
}

interface IActionButtonState {
}

export default ActionButton;
