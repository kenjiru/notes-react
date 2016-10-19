import {INote, IManifestNote} from "../model/store";

class NoteUtil {
    private static nodeMap: Object = {
        "note-content": "",
        bold: "b",
        italic: "i",
        strikethrough: "strike",
        highlight: {
            "element": "span",
            "style": "background: yellow"
        },
        "size:small": {
            "element": "span",
            "style": "font-size: small"
        },
        "size:large": {
            "element": "span",
            "style": "font-size: large"
        },
        "size:huge": {
            "element": "span",
            "style": "font-size: xx-large"
        },
        "list": "ul",
        "list-item": "li"
    };

    public static getTitle(noteContent: string): string {
        let matches: string[] = noteContent.match(/^(.*)[\r\n]/);

        if (matches !== null) {
            return matches[1];
        }
    }

    public static getText(note: INote): string {
        let tagRe: RegExp = /(<([^>]+)>)/ig;

        return note.content.replace(tagRe, "");
    }

    public static convertToNote(note: IManifestNote, noteStr: string): INote {
        return {
            id: note.id,
            rev: note.rev,
            title: NoteUtil.getNodeValue(noteStr, "title"),
            lastChanged: NoteUtil.getNodeValue(noteStr, "last-change-date"),
            content: NoteUtil.getNodeValue(noteStr, "note-content")
        };
    }

    private static getNodeValue(xmlStr: string, tagName: string): string {
        let re: RegExp = new RegExp(`<${tagName}.*>([\\s\\S]*)<\/${tagName}>`);

        let result: string[] = xmlStr.match(re);

        if (result) {
            return result[1];
        }

        return "";
    }

    public static convertToHtml(noteContent: string): string {
        noteContent = NoteUtil.replaceTitle(noteContent);
        noteContent = NoteUtil.replaceNewLines(noteContent);
        noteContent = NoteUtil.replaceAllTags(noteContent);

        return noteContent;
    }

    private static replaceTitle(text: string): string {
        text = text.replace(/<(\/)?note-content[^>]*>/g, "");

        return text.replace(/^(.*)([\r\n]+.*)/, "<h1>$1</h1>$2");
    }

    private static replaceNewLines(text: string): string {
        let lines: string[] = text.split(/[\r\n]+/);

        lines = _.map(lines, (line: string): string => {
            if (line[0] !== "<") {
                return line.replace(/^(.+?)$/g,"<p>$1</p>");
            }

            return line;
        });

        return lines.join("");
    }

    private static replaceAllTags(text) {
        for (var key in NoteUtil.nodeMap) {
            text = NoteUtil.replaceTag(text, key, NoteUtil.nodeMap[key]);
        }

        return text;
    }

    private static replaceTag(text, initialTag, finalTag) {
        var bothTags = `<(\/)?${initialTag}( [^>]*)*>`,
            startTag = `<${initialTag}( [^>]*)*>`,
            endTag = `<\/${initialTag}>`,
            regExp;

        if (typeof finalTag === "string") {
            regExp = new RegExp(bothTags, "g");
            text = text.replace(regExp, `<$1${finalTag}>`);
        } else {
            regExp = new RegExp(startTag, "g");
            text = text.replace(regExp, `<${finalTag.element} style="${finalTag.style}">`);

            regExp = new RegExp(endTag, "g");
            text = text.replace(regExp, `</${finalTag.element}>`);
        }

        return text;
    }
}

export default NoteUtil;
