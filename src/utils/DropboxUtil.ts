import * as _ from "lodash";
import * as Dropbox from "dropbox";

import {IManifest, INote, IManifestNote, ILock} from "../model/store";

import FileUtil from "./FileUtil";
import ManifestUtil from "./ManifestUtil";
import NoteUtil from "./NoteUtil";
import LockUtil from "./LockUtil";

const CLIENT_ID: string = "17zzlf216nsykj9";

class DropboxUtil {
    private static instance: DropboxUtil = null;
    public static NEVER_SYNCED_REVISION: number = -1;

    private dropbox: any;

    public static getAuthUrl(): string {
        let dropbox: any = new Dropbox({clientId: CLIENT_ID});

        return dropbox.getAuthenticationUrl(`http://localhost:8080/dropbox-auth.html`);
    }

    public static getInstance(): DropboxUtil {
        if (_.isNil(DropboxUtil.instance)) {
            DropboxUtil.instance = new DropboxUtil();
        }

        return DropboxUtil.instance;
    }

    private constructor() {
        this.dropbox = new Dropbox({
            clientId: CLIENT_ID
        });
    }

    public setAccessToken(accessToken: string) {
        this.dropbox.setAccessToken(accessToken);
    }

    public getCurrentAccount(): Promise<any> {
        return this.dropbox.usersGetCurrentAccount();
    }

    public revokeAccess(): Promise<any> {
        return this.dropbox.authTokenRevoke();
    }

    public getSyncData(lastSyncRevision: number): Promise<ISyncData> {
        let baseRevision: number = 0;

        if (lastSyncRevision !== DropboxUtil.NEVER_SYNCED_REVISION) {
            baseRevision = lastSyncRevision;
        }

        return this.setLock().then(() => {
            return Promise.all([
                this.readManifest(),
                this.readManifestFor(baseRevision)
            ]).then(([manifest, baseManifest]: IManifest[]): Promise<ISyncData> => {
                console.log("readManifest", manifest);

                return this.readNotes(manifest).then((remoteNotes: INote[]): ISyncData => {
                    console.log("readNotes", remoteNotes);

                    return {
                        remoteNotes,
                        remoteRevision: manifest.revision,
                        baseManifest
                    };
                });
            });
        }).then((dropboxSyncResult: ISyncData) => {
            this.removeLock();

            return dropboxSyncResult;
        }, (error: any) => {
            this.removeLock();

            return error;
        });
    }

    public saveNewRevision(notes: INote[], revision: number, serverId: string): Promise<any> {
        let manifest: IManifest = ManifestUtil.createManifest(notes, revision, serverId);

        let uploadEntries: IUploadEntry[] = _.concat(
            this.saveManifestFile(manifest),
            this.saveAllNoteFiles(notes, revision)
        );

        let uploadRequests: Promise<any>[] = _.map(uploadEntries, (uploadEntry: IUploadEntry): any =>
            this.dropbox.filesUploadSessionStart({
                contents: uploadEntry.contents,
                close: true
            })
        );

        return Promise.all(uploadRequests).then((uploadSessions: any[]) => {
            let batchEntries: any = _.map(uploadSessions, (uploadSession: any, index: number) => ({
                cursor: {
                    session_id: uploadSession.session_id,
                    offset: uploadEntries[index].contents.size
                },
                commit: {
                    "path": uploadEntries[index].path,
                    "mode": {
                        ".tag": "overwrite"
                    }
                }
            }));

            return this.dropbox.filesUploadSessionFinishBatch({
                entries: batchEntries
            });
        });
    }

    private saveManifestFile(manifest: IManifest): IUploadEntry[] {
        let manifestPath: string = this.getManifestPath(manifest.revision);
        let manifestContents: string = ManifestUtil.createManifestFile(manifest);
        let manifestBlob: Blob = new Blob([manifestContents]);

        return [
            {
                contents: manifestBlob,
                path: "/manifest.xml"
            }, {
                contents: manifestBlob,
                path: manifestPath
            }
        ];
    }

    private saveAllNoteFiles(notes: INote[], revision: number): IUploadEntry[] {
        let modifiedNotes: INote[] = _.filter(notes, (note: INote): boolean =>
        note.rev === NoteUtil.CHANGED_LOCALLY_REVISION);

        _.each(modifiedNotes, (note: INote): void => {
            note.rev = revision
        });

        return _.map(modifiedNotes, (note: INote): IUploadEntry => {
            let noteContents: string = NoteUtil.createNoteFile(note);

            return {
                contents: new Blob([noteContents]),
                path: this.getNotePath(note)
            };
        });
    }

    public hasLock(): Promise<boolean> {
        return this.dropbox.filesGetMetadata({
            path: "/lock"
        }).then(result => true, error => false);
    }

    public readLock(): Promise<ILock> {
        return this.dropbox.filesDownload({
            path: "/lock"
        })
            .then(result => result.fileBlob)
            .then(FileUtil.blobToObject)
            .then(LockUtil.convertLock);
    }

    public setLock(): Promise<any> {
        return this.dropbox.filesUpload({
            path: "/lock",
            contents: LockUtil.newLockContents("temp-lock-id", 3)
        });
    }

    public removeLock(): Promise<any> {
        return this.dropbox.filesDelete({
            path: "/lock"
        });
    }

    public readManifest(): Promise<IManifest> {
        return this.readManifestFile("/manifest.xml");
    }

    public readManifestFor(revision: number): Promise<IManifest> {
        let manifestPath: string = this.getManifestPath(revision);

        return this.readManifestFile(manifestPath);
    }

    private readManifestFile(filePath: string): Promise<IManifest> {
        return this.dropbox.filesDownload({
            path: filePath
        })
            .then(result => result.fileBlob)
            .then(FileUtil.blobToObject)
            .then(ManifestUtil.convertManifest);
    }

    public readNotes(manifest: IManifest): Promise<INote[]> {
        let promises: Promise<INote>[] = _.map(manifest.notes, (note: IManifestNote): Promise<INote> =>
            this.dropbox.filesDownload({
                path: this.getNotePath(note)
            })
                .then(result => result.fileBlob)
                .then(FileUtil.blobToString)
                .then(NoteUtil.convertToNote.bind(null, note))
        );

        return Promise.all(promises);
    }

    private getManifestPath(revision: number): string {
        let parentFolder: number = Math.floor(revision / 100);

        return `/${parentFolder.toString()}/${revision.toString()}/manifest.xml`;
    }

    private getNotePath(note: INote|IManifestNote): string {
        let parentFolder: number = Math.floor(note.rev / 100);

        return `/${parentFolder.toString()}/${note.rev.toString()}/${note.id}.note`;
    }
}

export interface ISyncData {
    remoteNotes: INote[];
    remoteRevision: number,
    baseManifest: IManifest;
}

export interface IUploadEntry {
    contents: Blob;
    path: string;
}

export default DropboxUtil;
