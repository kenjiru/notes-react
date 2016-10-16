import {ContentState, Entity} from "draft-js";
import {convertFromHTML, convertToHTML} from "draft-convert";

class EditorUtil {
    public static convertToHtml(contentState: ContentState): string {
        return convertToHTML({
            styleToHTML: {
                "BOLD": {
                    start: "<bold>",
                    end: "</bold>"
                },
                "ITALIC": {
                    start: "<italic>",
                    end: "</italic>"
                },
                "STRIKETHROUGH": {
                    start: "<strikethrough>",
                    end: "</strikethrough>"
                },
                "HIGHLIGHT": {
                    start: "<highlight>",
                    end: "</highlight>"
                },
                "CODE": {
                    start: "<monospace>",
                    end: "</monospace>"
                }
            },
            blockToHTML: {
                "header-one": {
                    start: "",
                    end: "\n"
                },
                "unordered-list-item": {
                    start: "<list-item>",
                    end: "</list-item>",
                    nestStart: "<list>",
                    nestEnd: "</list>"
                },
                "unstyled": {
                    start: "",
                    end: "\n"
                }
            }
        })(contentState);
    }
}

export default EditorUtil;
