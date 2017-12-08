class SlateUtil {
    private static DEFAULT_NODE: string = "paragraph";
    private static BULLETED_LIST: string = "bulleted-list";
    private static NUMBERED_LIST: string = "numbered-list";
    private static LIST_ITEM: string = "list-item";

    public static toggleMark(editorState: any, type: string): void {
        return editorState
            .change()
            .toggleMark(type)
            .value;
    }

    public static toggleBlock(editorState: any, type: string): any {
        if (type != SlateUtil.BULLETED_LIST && type != SlateUtil.NUMBERED_LIST) {
            return SlateUtil.toggleSimpleBlock(editorState, type);
        } else {
            return SlateUtil.toggleList(editorState, type);
        }
    }

    private static toggleSimpleBlock(editorState: any, type: string): void {
        const change = editorState.change();
        const isActive: boolean = SlateUtil.hasBlock(editorState, type);
        const isList: boolean = SlateUtil.hasBlock(editorState, SlateUtil.LIST_ITEM);

        if (isList) {
            change
                .setBlock(isActive ? SlateUtil.DEFAULT_NODE : type)
                .unwrapBlock(SlateUtil.BULLETED_LIST)
                .unwrapBlock(SlateUtil.NUMBERED_LIST);
        } else {
            change
                .setBlock(isActive ? SlateUtil.DEFAULT_NODE : type);
        }

        return change.value;
    }

    private static toggleList(editorState: any, type: string): void {
        const change = editorState.change();
        const document = editorState.document;

        const isList: boolean = SlateUtil.hasBlock(editorState, SlateUtil.LIST_ITEM);
        const isType: boolean = editorState.blocks.some((block) => {
            return !!document.getClosest(block.key, parent => parent.type == type);
        });

        if (isList && isType) {
            change
                .setBlock(SlateUtil.DEFAULT_NODE)
                .unwrapBlock(SlateUtil.BULLETED_LIST)
                .unwrapBlock(SlateUtil.NUMBERED_LIST);
        } else if (isList) {
            change
                .unwrapBlock(type == SlateUtil.BULLETED_LIST ? SlateUtil.NUMBERED_LIST : SlateUtil.BULLETED_LIST)
                .wrapBlock(type);
        } else {
            change
                .setBlock(SlateUtil.LIST_ITEM)
                .wrapBlock(type);
        }

        return change.value;
    }

    public static hasBlock(editorState: any, type: string): boolean {
        return editorState.blocks.some(node => node.type == type);
    }
}

export default SlateUtil;
