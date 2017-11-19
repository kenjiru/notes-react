/**
 * Used for debug.
 */
const RawSerializer = {
    serialize(model) {
        return RawSerializer.serializeState(model)
    },

    serializeState(state) {
        return {
            document: RawSerializer.serializeDocument(state.document),
            kind: state.kind
        };
    },

    serializeDocument(document) {
        return {
            data: document.data.toJSON(),
            key: document.key,
            kind: document.kind,
            nodes: document.nodes
                .toArray()
                .map(node => RawSerializer.serializeNode(node))
        };
    },

    serializeNode(node): any {
        switch (node.kind) {
            case 'block':
                return RawSerializer.serializeBlock(node);
            case 'document':
                return RawSerializer.serializeDocument(node);
            case 'inline':
                return RawSerializer.serializeInline(node);
            case 'text':
                return RawSerializer.serializeText(node);
            default: {
                throw new Error(`Unrecognized node kind "${node.kind}".`);
            }
        }
    },

    serializeBlock(block) {
        return {
            data: block.data.toJSON(),
            key: block.key,
            kind: block.kind,
            isVoid: block.isVoid,
            type: block.type,
            nodes: block.nodes
                .toArray()
                .map(node => RawSerializer.serializeNode(node))
        };
    },

    serializeInline(inline) {
        return {
            data: inline.data.toJSON(),
            key: inline.key,
            kind: inline.kind,
            isVoid: inline.isVoid,
            type: inline.type,
            nodes: inline.nodes
                .toArray()
                .map(node => RawSerializer.serializeNode(node))
        }
    },

    serializeText(text) {
        return {
            key: text.key,
            kind: text.kind,
            ranges: text
                .getRanges()
                .toArray()
                .map(range => RawSerializer.serializeRange(range))
        }
    },

    serializeRange(range) {
        return {
            kind: range.kind,
            text: range.text,
            marks: range.marks
                .toArray()
                .map(mark => RawSerializer.serializeMark(mark))
        };
    },

    serializeMark(mark) {
        return {
            data: mark.data.toJSON(),
            kind: mark.kind,
            type: mark.type
        };
    },
};

export default RawSerializer;
