const merge = require("webpack-merge");
const path = require("path");
const base = require("notes-react-core/webpack.config");

const src_dir = path.join(__dirname, "/src");

module.exports = merge({}, base, {
    entry: {
        app: src_dir + "/app-page.tsx",
        dropboxAuth: src_dir + "/dropbox-auth-page.tsx",
        vendor: ["react", "react-dom", "react-router", "react-redux", "lodash", "moment",
            "material-ui", "react-tap-event-plugin", "keycode",
            "material-design-icons-iconfont/dist/material-design-icons.css",
            "store"]
    },
});
