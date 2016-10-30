import * as _ from "lodash";
import {IManifest, INote, IManifestNote} from "../model/store";
import NoteUtil from "./NoteUtil";

class ManifestUtil {
    public static convertManifest(manifestObj: any): IManifest {
        return {
            revision: parseInt(manifestObj.sync["_revision"]),
            serverId: manifestObj.sync["_server-id"],
            notes: _.map(manifestObj.sync.note, (note: any) => ({
                id: note["_id"],
                rev: parseInt(note["_rev"])
            }))
        };
    }

    public static createManifest(notes: INote[], revision: number, serverId: string): IManifest {
        return {
            revision,
            serverId,
            notes: _.map(notes, (note: INote): IManifestNote => ({
                id: note.id,
                rev: note.rev === NoteUtil.CHANGED_LOCALLY_REVISION ? revision : note.rev
            }))
        };
    }

    public static createManifestFile(manifest: IManifest): string {
        let notes: string[] = _.map(manifest.notes, (note: IManifestNote): string =>
            `    <note id="${note.id}" rev="${note.rev}" />`
        );

        return `<?xml version="1.0" encoding="utf-8"?>
<sync revision="${manifest.revision}" server-id="${manifest.serverId}">
${notes.join("\n")}
</sync>`;
    }
}

export default ManifestUtil;
