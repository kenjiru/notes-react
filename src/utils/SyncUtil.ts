import * as _ from "lodash";
import * as moment from "moment";
import {INote, IStore} from "../model/store";

class SyncUtil {
    public static syncNotes(state: IStore): ISyncResult {
        let lastSyncDate: string = state.dropbox.lastSyncDate;
        let newLocalNotes: INote[] = [];
        let newRemoteNotes: INote[] = [];

        _.each(state.local.notes, (localNote: INote): void => {
            let remoteNote: INote = SyncUtil.findNote(state.dropbox.notes, localNote.id);

            if (SyncUtil.allNotesAreNewer([localNote, remoteNote], lastSyncDate)) {
                // TODO Better way to decide which note to pick
                newLocalNotes.push(localNote);
            } else if (SyncUtil.noteIsNewer(localNote, lastSyncDate)) {
                newLocalNotes.push(localNote);
            } else if (SyncUtil.noteIsNewer(remoteNote, lastSyncDate)) {
                newRemoteNotes.push(remoteNote);
            }
        });

        _.each(state.dropbox.notes, (remoteNote: INote): void => {
            let localNote: INote = SyncUtil.findNote(state.local.notes, remoteNote.id);

            if (_.isNil(localNote)) {
                newRemoteNotes.push(remoteNote);
            }
        });

        return {
            newLocalNotes,
            newRemoteNotes
        };
    }

    private static findNote(notes: INote[], noteId): INote {
        return _.find(notes, (note: INote): boolean => note.id === noteId);
    }

    private static allNotesAreNewer(notes: INote[], lastSyncedDate: string): boolean {
        return _.some(notes, (note: INote) => SyncUtil.noteIsNewer(note, lastSyncedDate) === false) === false;
    }

    private static noteIsNewer(note: INote, lastSyncedDate: string): boolean {
        return _.isNil(note) === false && moment(note.lastChanged).isAfter(lastSyncedDate);
    }
}

export interface ISyncResult {
    newLocalNotes: INote[];
    newRemoteNotes: INote[];
}

export default SyncUtil;
