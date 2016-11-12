import * as _ from "lodash";
import * as moment from "moment";

import {INote} from "../model/store";
import NoteUtil from "./NoteUtil";

class FolderUtil {
    public static NO_FOLDER: string = "NO-FOLDER";

    public static getFolders(notes: INote[]): string[] {
        let tags: string[] = _.flatMap(notes, (note: INote): string[] => note.tags || []);

        tags = _.uniq(tags);
        tags = _.filter(tags, (tag: string): boolean => tag.indexOf("system:notebook") !== -1);

        return _.map(tags, (tag: string): string => {
            let lastColumn: number = tag.lastIndexOf(":");

            return tag.substring(lastColumn + 1);
        })
    }

    public static getFolder(note: INote): string {
        let folder: string = FolderUtil.NO_FOLDER;

        _.each(note.tags, (tag: string): void => {
            if (tag.indexOf("system:notebook") !== -1) {
                let lastColumn: number = tag.lastIndexOf(":");

                folder = tag.substring(lastColumn + 1);
            }
        });

        return folder;
    }

    public static setFolder(note: INote, folder: string): void {
        let currentFolder: string = FolderUtil.getFolder(note);

        if (currentFolder === folder) {
            return;
        }

        note.tags = _.filter(note.tags, (tag: string): boolean => tag.indexOf("system:notebook") === -1);

        if (folder !== FolderUtil.NO_FOLDER) {
            note.tags.push(`system:notebook:${folder}`);
        }

        note.lastMetadataChanged = moment().format();
        note.rev = NoteUtil.CHANGED_LOCALLY_REVISION;
    }
}

export default FolderUtil;
