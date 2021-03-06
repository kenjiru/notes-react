import * as _ from "lodash";
import * as parseUrl from "url-parse";

class WindowUtil {
    public static GENERIC_MESSAGE: string = "NOTES-REACT-GENERIC-MESSAGE";

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

    public static postMessageToParent(payload: any, type: string = WindowUtil.GENERIC_MESSAGE): void {
        const global: any = window;

        if (typeof global.ipc !== "undefined") {
            global.ipc.send("ELECTRON_MESSAGE", {type, payload});
        }

        // postMessageToParent requires that you put the correct protocol
        if (_.isNil(window.opener) === false) {
            const targetOrigin = WindowUtil.getTargetOrigin();

            window.opener.postMessage({type, payload}, targetOrigin);
        }
    }

    private static getTargetOrigin(): string {
        let targetOrigin: string = location.protocol + "//" + location.hostname;

        if (location.port) {
            targetOrigin += ":" + location.port;
        }

        return targetOrigin;
    }

    public static openAuthWindow(url: string, callback: Function, options?: string): void {
        let win: any = WindowUtil.openWindow(url, options);

        // In Electron, the BrowserWindowProxy does not have a method addEventListener()
        if (typeof win.addEventListener !== "undefined") {
            win.addEventListener("loadstop", (ev: any) => {
                let parsed: any = parseUrl(ev.url, true);
                let params: any = WindowUtil.getHashParams(parsed.hash);

                if (_.isNil(params.access_token) === false) {
                    callback(params);
                    win.close();
                }
            });
        }

        const global: any = window;

        if (typeof global.ipc !== "undefined") {
            global.ipc.on("ELECTRON_MESSAGE", (event, {payload}) => {
                callback(payload);
            });
        }
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
