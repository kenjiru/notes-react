const schema = {
    document: {
        nodes: [
            {types: ['paragraph']}
        ]
    },
    blocks: {
        paragraph: {
            nodes: [
                {kinds: ['text']}
            ]
        }
    }
};

export default schema;
