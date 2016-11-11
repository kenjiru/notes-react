import * as _ from "lodash";
import * as moment from "moment";
import {INote, IManifestNote, IManifest} from "../model/store";
import FolderUtil from "./FolderUtil";

class SyncUtil {
    public static syncNotes(localNotes: INote[], remoteNotes: INote[], baseManifest: IManifest,
                            lastSyncDate: string): ISyncResult {
        let lastSyncRevision: number = baseManifest.revision;
        let modifiedLocally: INote[] = [];
        let modifiedRemotely: INote[] = [];
        let deletedLocally: INote[] = [];
        let deletedRemotely: INote[] = [];

        console.log("lastSyncDate", lastSyncDate);

        _.each(localNotes, (localNote: INote): void => {
            let remoteNote: INote = SyncUtil.findNote(remoteNotes, localNote.id);

            if (_.isNil(remoteNote) && localNote.rev <= lastSyncRevision) {
                deletedRemotely.push(localNote);
            } else if (SyncUtil.areAllNotesNewer([localNote, remoteNote], lastSyncDate)) {
                // TODO Better way to decide which note to pick
                modifiedLocally.push(localNote);
            } else if (SyncUtil.isNoteNewer(remoteNote, lastSyncDate)) {
                modifiedRemotely.push(remoteNote);
            }

            if (SyncUtil.isNoteNewer(localNote, lastSyncDate)) {
                modifiedLocally.push(localNote);
            }
        });

        _.each(remoteNotes, (remoteNote: INote): void => {
            let localNote: INote = SyncUtil.findNote(localNotes, remoteNote.id);
            let baseNote: IManifestNote = SyncUtil.findManifestNote(baseManifest, remoteNote.id);

            if (_.isNil(localNote)) {
                if (_.isNil(baseNote) === false && remoteNote.rev > lastSyncRevision) {
                    deletedLocally.push(remoteNote);
                } else {
                    modifiedRemotely.push(remoteNote);
                }
            }
        });

        console.log({modifiedLocally, deletedLocally, modifiedRemotely, deletedRemotely});

        let deletedRemotelyOnly: INote[] = _.differenceBy(deletedRemotely, modifiedLocally);
        let deletedLocallyOnly: INote[] = _.differenceBy(modifiedLocally, deletedRemotely);

        let resultNotes: INote[] = _.differenceBy(localNotes, deletedRemotelyOnly, "id");
        resultNotes = _.unionBy(modifiedLocally, modifiedRemotely, resultNotes, "id");

        let isModifiedLocally: boolean = deletedLocallyOnly.length > 0 || modifiedLocally.length > 0;
        let idModifiedRemotely: boolean = deletedRemotelyOnly.length > 0 || modifiedRemotely.length > 0;

        return {
            notes: resultNotes,
            folders: FolderUtil.getFolders(resultNotes),
            isModifiedLocally,
            idModifiedRemotely
        };
    }

    private static findManifestNote(manifest: IManifest, noteId): IManifestNote {
        return _.find(manifest.notes, (manifestNote: IManifestNote): boolean => manifestNote.id === noteId);
    }

    private static findNote(notes: INote[], noteId): INote {
        return _.find(notes, (note: INote): boolean => note.id === noteId);
    }

    private static areAllNotesNewer(notes: INote[], lastSyncedDate: string): boolean {
        return _.some(notes, (note: INote) => SyncUtil.isNoteNewer(note, lastSyncedDate) === false) === false;
    }

    private static isNoteNewer(note: INote, lastSyncedDate: string): boolean {
        return _.isNil(note) === false && moment(note.lastChanged).isAfter(lastSyncedDate);
    }
}

export interface ISyncResult {
    notes: INote[];
    folders: string[];
    isModifiedLocally: boolean;
    idModifiedRemotely: boolean;
}

export default SyncUtil;
