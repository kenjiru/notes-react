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

        console.log("targetOrigin: ", targetOrigin);

        // postMessageToParent requires that you put the correct protocol
        window.opener.postMessage(message, window.location.protocol + window.location.host);
    }

    public static openWindow(url: string, options?: string): Window {
        options = options || "";

        return window.open(url, "Dropbox Authentication", options);
    }
}

export default WindowUtil;
