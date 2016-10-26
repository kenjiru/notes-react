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

    public readLock(): Promise<ILock> {
        return this.dropbox.filesDownload({
            path: "/lock"
        })
            .then(result => result.fileBlob)
            .then(FileUtil.blobToObject)
            .then(LockUtil.convertLock);
    }

    public readManifest(): Promise<IManifest> {
        return this.dropbox.filesDownload({
            path: "/manifest.xml"
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

    private getNotePath(note: IManifestNote): string {
        let parentFolder: number = Math.floor(note.rev / 100);

        return `/${parentFolder.toString()}/${note.rev.toString()}/${note.id}.note`;
    }
}

export default DropboxUtil;
