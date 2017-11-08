const path = require('path');
const merge = require('webpack-merge');
const webpack = require("webpack");

const base = require('./webpack.config');

const port = process.env.PORT || 8080;
const publicPath = `http://localhost:${port}`;

module.exports = merge({}, base, {
    target: 'web',
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
