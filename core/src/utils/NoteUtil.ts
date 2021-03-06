import * as _ from "lodash";
import * as moment from "moment";

import {INote, IManifestNote} from "../model/store";
import IdUtil from "./IdUtil";
import FolderUtil from "./FolderUtil";

class NoteUtil {
    public static CHANGED_LOCALLY_REVISION: number = Number.MAX_VALUE;

    private static nodeMap: Object = {
        "note-content": "",
        bold: "b",
        italic: "i",
        strikethrough: "del",
        highlight: {
            "element": "span",
            "style": "background: yellow"
        },
        monospace: {
            "element": "span",
            "style": "font-family: monospace"
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

    public static isTemplateNote(note: INote): boolean {
        return NoteUtil.hasTag(note, "system:template");
    }

    private static hasTag(note: INote, targetTag: string): boolean {
        return _.some(note.tags, (tag: string): boolean => tag === targetTag);
    }

    public static createTemplateNote(folder: string): INote {
        let tags: string[] = [
            "system:template",
            `system:notebook:${folder}`
        ];

        return NoteUtil.createNote(IdUtil.newId(), tags);
    }

    public static createNewNote(noteId: string, folder: string): INote {
        let tags: string[] = [];

        if (FolderUtil.isValidFolder(folder)) {
            tags.push(`system:notebook:${folder}`);
        }

        return NoteUtil.createNote(noteId, tags);
    }

    public static createNote(noteId: string, tags?: string[]): INote {
        let noteTitle: string = "New Note";
        let currentDateTime = moment().format();

        return {
            id: noteId,
            rev: NoteUtil.CHANGED_LOCALLY_REVISION,
            title: noteTitle,
            createDate: currentDateTime,
            lastChanged: currentDateTime,
            lastMetadataChanged: currentDateTime,
            content: noteTitle + "\nNew note content",
            tags
        };
    }

    public static createNoteFile(note: INote): string {
        return `<?xml version="1.0" encoding="utf-8"?>
<note version="0.3" xmlns:link="http://beatniksoftware.com/tomboy/link" xmlns:size="http://beatniksoftware.com/tomboy/size" xmlns="http://beatniksoftware.com/tomboy">
  <title>${note.title}</title>
  <text xml:space="preserve"><note-content version="0.1">${note.content}</note-content></text>
  <last-change-date>${note.lastChanged}</last-change-date>
  <last-metadata-change-date>${note.lastMetadataChanged}</last-metadata-change-date>
  <create-date>${note.createDate}</create-date>
  <cursor-position>0</cursor-position>
  <selection-bound-position>33</selection-bound-position>
  <width>450</width>
  <height>360</height>
  <x>0</x>
  <y>0</y>
  ${NoteUtil.createTagsNode(note.tags)}
  <open-on-startup>False</open-on-startup>
</note>`;
    }

    private static createTagsNode(tags: string[]): string {
        if (_.isArray(tags) === false || tags.length === 0) {
            return;
        }

        return `  <tags>
${NoteUtil.createTagNode(tags)}
  </tags>`;
    }

    private static createTagNode(tags: string[]): string[] {
        return _.map(tags, (tag: string): string => `    <tag>${tag}</tag>`);
    }

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

    public static convertToNote(manifestNote: IManifestNote, noteStr: string): INote {
        return {
            id: manifestNote.id,
            rev: manifestNote.rev,
            title: NoteUtil.getNodeValue(noteStr, "title"),
            createDate: NoteUtil.getNodeValue(noteStr, "create-date"),
            lastChanged: NoteUtil.getNodeValue(noteStr, "last-change-date"),
            lastMetadataChanged: NoteUtil.getNodeValue(noteStr, "last-metadata-change-date"),
            content: NoteUtil.getNodeValue(noteStr, "note-content"),
            tags: NoteUtil.getAllNodeValues(noteStr, "tag")
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

    private static getAllNodeValues(xmlStr: string, tagName: string): string[] {
        let values: string[] = [];
        let re: RegExp = new RegExp(`(?:<${tagName}>)([\\s\\S]*?)(?:<\/${tagName}>)`, "g");

        let result: string[];
        while (result = re.exec(xmlStr)) {
            values.push(result[1]);
        }

        return values;
    }

    public static convertToHtml(noteContent: string): string {
        noteContent = NoteUtil.replaceTitle(noteContent);
        noteContent = NoteUtil.replaceNewLines(noteContent);
        noteContent = NoteUtil.replaceAllTags(noteContent);

        return noteContent;
    }

    private static replaceTitle(text: string): string {
        text = text.replace(/<(\/)?note-content[^>]*>/g, "");

        return text.replace(/^(.*)([\r\n].*)/, "<h1>$1</h1>$2");
    }

    private static replaceNewLines(text: string): string {
        let lines: string[] = text.split(/[\r\n]/);

        lines = _.map(lines, (line: string): string => {
            if (NoteUtil.startsWithBlock(line)) {
                return `<p>${line}</p>`;
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

    private static startsWithBlock(line: string): boolean {
        return line.startsWith("<h1") === false && line.startsWith("<list") === false &&
            line.startsWith("</list") === false;
    }
}

export default NoteUtil;
