import * as _ from "lodash";
import {INote} from "../model/store";

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
}

export default FolderUtil;
