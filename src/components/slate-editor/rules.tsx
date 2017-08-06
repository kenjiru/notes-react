import * as React from "react";

const BLOCK_TAGS = {
    h1: "header",
    p: "paragraph",
    ul: "bulleted-list",
    li: "list-item"
};

const MARK_TAGS = {
    i: "italic",
    b: "bold",
    del: "strikethrough",
    monospace: "fixed"
};

const rules: any[] = [
    {
        deserialize(el: HTMLElement, next) {
            const tagName: string = el.tagName && el.tagName.toLowerCase();
            let type: string = BLOCK_TAGS[tagName];

            if (!type) {
                return;
            }

            return {
                kind: "block",
                type,
                nodes: next(el.childNodes)
            }
        },
        serialize(object, children) {
            if (object.kind != "block") return;

            switch (object.type) {
                case "header":
                    return <h1>{children}</h1>;
                case "paragraph":
                    return <p>{children}</p>;
                case "bulleted-list":
                    return <ul>{children}</ul>;
                case "list-item":
                    return <li>{children}</li>;
            }
        }
    },
    {
        deserialize(el, next) {
            const tagName: string = el.tagName && el.tagName.toLowerCase();
            let type: string = MARK_TAGS[tagName.toLowerCase()];

            if (tagName === "span") {
                if (el.style.background === "yellow") {
                    type = "highlight";
                } else if (el.style.fontSize === "small") {
                    type = "small";
                } else if (el.style.fontSize === "large") {
                    type = "large";
                } else if (el.style.fontSize === "xx-large") {
                    type = "xxlarge";
                } else if (el.style.fontFamily === "monospace") {
                    type = "fixed";
                }
            }

            if (!type) {
                return;
            }

            return {
                kind: "mark",
                type,
                nodes: next(el.childNodes)
            }
        },
        serialize(object, children) {
            if (object.kind != "mark") {
                return;
            }

            switch (object.type) {
                case "bold":
                    return <b>{children}</b>;
                case "italic":
                    return <i>{children}</i>;
                case "strikethrough":
                    return <del>{children}</del>;
                case "highlight":
                    return <span style={{background: "yellow"}}>{children}</span>;
                case "fixed":
                    return <span style={{fontFamily: "monospace"}}>{children}</span>;
                case "small":
                    return <span style={{fontSize: "small"}}>{children}</span>;
                case "large":
                    return <span style={{fontSize: "large"}}>{children}</span>;
                case "xxlarge":
                    return <span style={{fontSize: "xx-large"}}>{children}</span>;
            }
        }
    }
];

export default rules;
