import * as _ from "lodash";
import {IManifest} from "../model/store";

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
}

export default ManifestUtil;
