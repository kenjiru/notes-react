import * as Dropbox from "dropbox";

import {IManifest} from "../model/store";
import {CLIENT_ID} from "../model/actions";

import FileUtil from "./FileUtil";
import ManifestUtil from "./ManifestUtil";

export function getAuthUrl() {
    let dropbox: any = new Dropbox({clientId: CLIENT_ID});

    return dropbox.getAuthenticationUrl("http://localhost:8080/dropbox-auth.html");
}

class DropboxUtil {
    private dropbox: any;

    constructor(private clientId: string, private accessToken: string) {
        this.dropbox = new Dropbox({
            clientId: this.clientId,
            accessToken: this.accessToken
        });
    }

    public readManifest(): Promise<IManifest> {
        return this.dropbox.filesDownload({
            path: "/manifest.xml"
        })
            .then(result => result.fileBlob)
            .then(FileUtil.blobToObject)
            .then(ManifestUtil.convertManifest);
    }
}

export default DropboxUtil;
