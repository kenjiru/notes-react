import * as React from "react";
import {Toolbar, ToolbarGroup, IconButton} from "material-ui";

import "./EditToolbar.less";

class EditToolbar extends React.Component<IEditToolbarProps, IEditToolbarState> {
    public render(): React.ReactElement<any> {
        return (
            <div className="edit-note-toolbar">
                <Toolbar className="toolbar">
                    <ToolbarGroup className="toolbar-group" firstChild={true}>
                        <IconButton iconClassName="material-icons" tooltip="Bold"
                                    onClick={() => this.props.onToggleMark("bold")}>format_bold</IconButton>
                        <IconButton iconClassName="material-icons" tooltip="Italic"
                                    onClick={() => this.props.onToggleMark("italic")}>format_italic</IconButton>
                        <IconButton iconClassName="material-icons" tooltip="Strike through"
                                    onClick={() => this.props.onToggleMark("strikethrough")}>
                            format_strikethrough</IconButton>
                        <IconButton iconClassName="material-icons" tooltip="Highlight"
                                    onClick={() => this.props.onToggleMark("highlight")}>highlight</IconButton>
                        <IconButton iconClassName="material-icons" tooltip="Fixed width"
                                    onClick={() => this.props.onToggleMark("fixed")}>title</IconButton>

                        <IconButton iconClassName="material-icons" tooltip="Unordered list"
                                    onClick={() => this.props.onToggleBlock("bulleted-list")}>
                            format_list_bulleted
                        </IconButton>
                        <IconButton iconClassName="material-icons" tooltip="Ordered list"
                                    onClick={() => this.props.onToggleBlock("ordered-list-item")}>
                            format_list_numbered
                        </IconButton>

                        <IconButton iconClassName="material-icons"
                                    tooltip="List indent">format_indent_increase</IconButton>
                        <IconButton iconClassName="material-icons"
                                    tooltip="List outdent">format_indent_decrease</IconButton>

                        <IconButton iconClassName="material-icons" tooltip="Export to Note"
                                    onClick={this.props.onExportToHtml}>import_export</IconButton>
                    </ToolbarGroup>
                </Toolbar>
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
