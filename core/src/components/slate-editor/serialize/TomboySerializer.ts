const BlockMap = {
    "bulleted-list": "list",
    "list-item": "list-item",
};

class TomboySerializer {
    public static serialize(model) {
        return TomboySerializer.serializeState(model)
    }

    private static serializeState(state) {
        return TomboySerializer.serializeDocument(state.document);
    }

    private static serializeDocument(document) {
        return document.nodes
            .toArray()
            .map(node => TomboySerializer.serializeNode(node))
            .join("");
    }

    private static serializeNode(node) {
        switch (node.kind) {
            case 'block':
                return TomboySerializer.serializeBlock(node);
            case 'document':
                return TomboySerializer.serializeDocument(node);
            case 'inline':
                return TomboySerializer.serializeInline(node);
            case 'text':
                return TomboySerializer.serializeText(node);
            default: {
                throw new Error(`Unrecognized node kind "${node.kind}".`);
            }
        }
    }

    private static serializeBlock(block) {
        let tag = BlockMap[block.type];

        const children = block.nodes
            .toArray()
            .map(node => TomboySerializer.serializeNode(node))
            .join("");

        if (tag) {
            return `<${tag}>${children}</${tag}>\n`;
        }

        return `${children}\n`;
    }

    private static serializeInline(inline) {
        return inline.nodes
            .toArray()
            .map(node => TomboySerializer.serializeNode(node))
            .join("");
    }

    private static serializeText(text) {
        return text
            .getRanges()
            .toArray()
            .map(range => TomboySerializer.serializeRange(range))
            .join("");
    }

    private static serializeRange(range) {
        const marks = range.marks.toArray();

        return marks.reduce((result: string, mark: any) => {
            return TomboySerializer.serializeMark(mark, result);
        }, range.text);
    }

    private static serializeMark(mark, content) {
        return `<${mark.type}>${content}</${mark.type}>`;
    }
}

export default TomboySerializer;
