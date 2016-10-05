import * as Dropbox from "dropbox";
import {CLIENT_ID} from "../model/actions";

export function getAuthUrl() {
    let dropbox: any = new Dropbox({clientId: CLIENT_ID});

    return dropbox.getAuthenticationUrl("http://localhost:8080/dropbox-auth.html");
}
