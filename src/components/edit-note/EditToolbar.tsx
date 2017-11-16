import * as React from "react";
import { Toolbar, IconButton } from "material-ui";
import Icon from "material-ui/Icon";

import "./EditToolbar.less";

class EditToolbar extends React.Component<IEditToolbarProps, IEditToolbarState> {
    public render(): React.ReactElement<any> {
        return (
            <div className="edit-toolbar">
                <div className="toolbar">
                    <div className="toolbar-group">
                        <IconButton aria-label="Bold"
                                    onClick={() => this.props.onToggleMark("bold")}>
                            <Icon>format_bold</Icon>
                        </IconButton>
                        <IconButton aria-label="Italic"
                                    onClick={() => this.props.onToggleMark("italic")}>
                            <Icon>format_italic</Icon>
                        </IconButton>
                        <IconButton aria-label="Strike through"
                                    onClick={() => this.props.onToggleMark("strikethrough")}>
                            <Icon>format_strikethrough</Icon>
                        </IconButton>
                        <IconButton aria-label="Highlight"
                                    onClick={() => this.props.onToggleMark("highlight")}>
                            <Icon>highlight</Icon>
                        </IconButton>
                        <IconButton aria-label="Fixed width"
                                    onClick={() => this.props.onToggleMark("fixed")}>
                            <Icon>title</Icon>
                        </IconButton>

                        <IconButton aria-label="Unordered list"
                                    onClick={() => this.props.onToggleBlock("bulleted-list")}>
                            <Icon>format_list_bulleted</Icon>
                        </IconButton>
                        <IconButton aria-label="Ordered list"
                                    onClick={() => this.props.onToggleBlock("ordered-list-item")}>
                            <Icon>format_list_numbered</Icon>
                        </IconButton>

                        <IconButton aria-label="List indent">
                            <Icon>format_indent_increase</Icon>
                        </IconButton>
                        <IconButton aria-label="List outdent">
                            <Icon>format_indent_decrease</Icon>
                        </IconButton>

                        <IconButton aria-label="Export to Note"
                                    onClick={this.props.onExportToHtml}>
                            <Icon>import_export</Icon>
                        </IconButton>
                    </div>
                </div>
            </div>
        );
    }
}

interface IEditToolbarProps {
    onToggleMark: (mark: string) => void;
    onToggleBlock: (block: string) => void;
    onExportToHtml?: () => void;
}

interface IEditToolbarState {
}

export default EditToolbar;
