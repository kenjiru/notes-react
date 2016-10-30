import * as _ from "lodash";
import * as Dropbox from "dropbox";

import {IManifest, INote, IManifestNote, ILock} from "../model/store";
import {CLIENT_ID} from "../model/actions";

import FileUtil from "./FileUtil";
import ManifestUtil from "./ManifestUtil";
import NoteUtil from "./NoteUtil";
import LockUtil from "./LockUtil";

class DropboxUtil {
    private dropbox: any;

    public static getAuthUrl() {
        let dropbox: any = new Dropbox({clientId: CLIENT_ID});

        return dropbox.getAuthenticationUrl("http://localhost:8080/dropbox-auth.html");
    }

    constructor(private clientId: string, private accessToken: string) {
        this.dropbox = new Dropbox({
            clientId: this.clientId,
            accessToken: this.accessToken
        });
    }

    public saveNewRevision(notes: INote[], revision: number, serverId: string): Promise<any> {
        let manifest: IManifest = ManifestUtil.createManifest(notes, revision, serverId);

        return Promise.all([
            this.saveManifestFile(manifest),
            this.saveAllNoteFiles(notes, manifest.revision)
        ]);
    }

    private saveManifestFile(manifest: IManifest): Promise<any> {
        let manifestPath: string = this.getManifestPath(manifest.revision);
        let manifestContents: string = ManifestUtil.createManifestFile(manifest);

        console.log("saveManifestFile", manifestContents);

        return Promise.all([
            this.saveManifestFileAt("/manifest.xml", manifestContents),
            this.saveManifestFileAt(manifestPath, manifestContents)
        ]);
    }

    private saveManifestFileAt(path: string, contents: string): Promise<any> {
        return this.dropbox.filesUpload({
            path: path,
            contents: new Blob([contents]),
            mode: {
                ".tag": "overwrite"
            }
        });
    }

    private saveAllNoteFiles(notes: INote[], revision: number): Promise<any> {
        let modifiedNotes: INote[] = _.filter(notes, (note: INote): boolean =>
        note.rev === NoteUtil.CHANGED_LOCALLY_REVISION);

        _.each(modifiedNotes, (note: INote): void => {
            note.rev = revision
        });

        return Promise.all([
            _.map(modifiedNotes, (note: INote) => this.saveNote(note))
        ]);
    }

    private saveNote(note: INote): Promise<any> {
        let noteContents: string = NoteUtil.createNoteFile(note);
        let notePath: string = this.getNotePath(note);

        console.log("saveNote", notePath);

        return this.dropbox.filesUpload({
            path: notePath,
            contents: noteContents
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

export default DropboxUtil;
