const path = require('path');
const merge = require('webpack-merge');
const webpack = require("webpack");
const base = require("notes-react-core/webpack.config");

const src_dir = path.join(__dirname, "/src");

const port = process.env.PORT || 8080;
const publicPath = `http://localhost:${port}`;

module.exports = merge({}, base, {
    target: 'web',
    entry: {
        app: src_dir + "/app-page.tsx",
        dropboxAuth: src_dir + "/dropbox-auth-page.tsx",
        vendor: ["react", "react-dom", "react-router", "react-redux", "lodash", "moment",
            "material-ui", "react-tap-event-plugin", "keycode",
            "material-design-icons-iconfont/dist/material-design-icons.css",
            "store"]
    },
    output: {
        publicPath: `http://localhost:${port}`
    },
    node: {
        __dirname: false,
        __filename: false
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"electron"'
            }
        })
    ],
    devServer: {
        port,
        publicPath,
        hot: true,
        headers: {'Access-Control-Allow-Origin': '*'},
        contentBase: path.join(__dirname, 'dist')
    }
});
