import * as React from "react";

const schema = {
    nodes: {
        "header": props => <h1 {...props.attributes}>{props.children}</h1>,
        "paragraph": props => <p {...props.attributes}>{props.children}</p>,
        "bulleted-list": props => <ul {...props.attributes}>{props.children}</ul>,
        "list-item": props => <li {...props.attributes}>{props.children}</li>,
    },
    marks: {
        bold: props => <b>{props.children}</b>,
        italic: props => <i>{props.children}</i>,
        strikethrough: props => <del>{props.children}</del>,
        highlight: props => <span style={{background: "yellow"}}>{props.children}</span>,
        fixed: props => <span style={{fontFamily: "monospace"}}>{props.children}</span>,
        small: props => <span style={{fontSize: "small"}}>{props.children}</span>,
        large: props => <span style={{fontSize: "large"}}>{props.children}</span>,
        xxlarge: props => <span style={{fontSize: "xx-large"}}>{props.children}</span>,
    }
};

export default schema;
