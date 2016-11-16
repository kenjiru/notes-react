import * as _ from "lodash";
import * as parseUrl from "url-parse";

class WindowUtil {
    public static getQueryParam(name: string): string {
        let url: string = window.location.href;

        name = name.replace(/[\[\]]/g, "\\$&");
        let regex: RegExp = new RegExp("[?&|?#]" + name + "(=([^&#]*)|&|#|$)");

        let results: string[] = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return "";
        }

        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    public static postMessageToParent(message: any): void {
        let targetOrigin: string = location.protocol + "//" + location.hostname;

        if (location.port) {
            targetOrigin += ":" + location.port;
        }

        // postMessageToParent requires that you put the correct protocol
        if (_.isNil(window.opener) === false) {
            window.opener.postMessage(message, targetOrigin);
        }
    }

    public static openAuthWindow(url: string, callback: Function, options?: string): void {
        let win: any = WindowUtil.openWindow(url, options);

        win.addEventListener("loadstop", (ev: any) => {
            let parsed: any = parseUrl(ev.url, true);
            let params: any = WindowUtil.getHashParams(parsed.hash);

            if (_.isNil(params.access_token) === false) {
                callback(params);
                win.close();
            }
        });
    }

    public static openWindow(url: string, options?: string): Window {
        options = options || "location=no,closebuttoncaption=Done,toolbar=no";

        return window.open(url, "_blank", options);
    }

    private static getHashParams = (hash: string): Object => {
        var hashParams = {};
        var r = /([^&;=]+)=?([^&;]*)/g,
            decode = (str: string): string => decodeURIComponent(str.replace(/\+/g, " "));

        hash = hash.substring(1);
        let execResult: any;
        while (execResult = r.exec(hash)) {
            hashParams[decode(execResult[1])] = decode(execResult[2]);
        }

        return hashParams;
    }
}

export default WindowUtil;
