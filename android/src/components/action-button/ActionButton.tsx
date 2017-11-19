import * as React from "react";
import { Button } from "material-ui";
import AddIcon from 'material-ui-icons/Add';
import ActionDelete from "material-ui-icons/Delete";

import "./ActionButton.less";

class ActionButton extends React.Component<IActionButtonProps, IActionButtonState> {
    public render(): React.ReactElement<any> {
        return (
            <div className="action-button">
                <Button fab onClick={this.handleClick}>
                    {this.renderIcon()}
                </Button>
            </div>
        );
    }

    private renderIcon(): React.ReactElement<any> {
        if (this.props.isDelete) {
            return <ActionDelete/>;
        }

        return <AddIcon/>
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
