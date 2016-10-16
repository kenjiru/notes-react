import * as React from "react";
import {Toolbar, ToolbarGroup, IconButton} from "material-ui";

import "./EditToolbar.less";

class EditToolbar extends React.Component<IEditToolbarProps, IEditToolbarState> {
    public render(): React.ReactElement<any> {
        return (
            <div className="edit-note-toolbar">
                <Toolbar>
                    <ToolbarGroup className="edit-toolbar" firstChild={true}>
                        <IconButton iconClassName="material-icons" tooltip="Bold"
                                    onClick={() => this.props.toggleInlineStyle("BOLD")}>format_bold</IconButton>
                        <IconButton iconClassName="material-icons" tooltip="Italic"
                                    onClick={() => this.props.toggleInlineStyle("ITALIC")}>format_italic</IconButton>
                        <IconButton iconClassName="material-icons" tooltip="Strike through"
                                    onClick={() => this.props.toggleInlineStyle("STRIKETHROUGH")}>
                            format_strikethrough</IconButton>
                        <IconButton iconClassName="material-icons" tooltip="Highlight"
                                    onClick={() => this.props.toggleInlineStyle("HIGHLIGHT")}>highlight</IconButton>
                        <IconButton iconClassName="material-icons" tooltip="Fixed width"
                                    onClick={() => this.props.toggleInlineStyle("CODE")}>title</IconButton>

                        <IconButton iconClassName="material-icons" tooltip="Unordered list"
                                    onClick={() => this.props.toggleBlockStyle("unordered-list-item")}>
                            format_list_bulleted
                        </IconButton>
                        <IconButton iconClassName="material-icons" tooltip="Ordered list"
                                    onClick={() => this.props.toggleBlockStyle("ordered-list-item")}>
                            format_list_numbered
                        </IconButton>

                        <IconButton iconClassName="material-icons"
                                    tooltip="List indent">format_indent_increase</IconButton>
                        <IconButton iconClassName="material-icons"
                                    tooltip="List outdent">format_indent_decrease</IconButton>

                        <IconButton iconClassName="material-icons" tooltip="Export to Note"
                                    onClick={this.props.exportToHtml}>import_export</IconButton>
                    </ToolbarGroup>
                </Toolbar>
            </div>
        );
    }
}

interface IEditToolbarProps {
    toggleInlineStyle: (command: string) => void;
    toggleBlockStyle: (command: string) => void;
    exportToHtml: () => void;
}

interface IEditToolbarState {
}

export default EditToolbar;
