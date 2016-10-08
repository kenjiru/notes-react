import * as blobUtil from "blob-util";
import * as X2JS from "x2js";
import {TextDecoder} from "text-encoding";

class FileUtil {
    public static blobToObject(fileBlob: Blob): Promise<Object> {
        return FileUtil.blobToString(fileBlob).then((text: string) => {
            let x2js: any = new X2JS();

            return x2js.xml2js(text);
        });
    }

    public static blobToString(fileBlob: Blob): Promise<string> {
        return blobUtil.blobToArrayBuffer(fileBlob).then(arrayBuffer => {
            let decodedStr: string = new TextDecoder("utf-8").decode(arrayBuffer);

            return decodedStr;
        });
    }
}

export default FileUtil;
