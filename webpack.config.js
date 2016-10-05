var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");

var src_dir = path.join(__dirname, "/src");
const nodeEnv = process.env.NODE_ENV || "development";

var config = {
    devtool: "cheap-module-eval-source-map",
    cache : true,
    context: __dirname,
    entry: {
        app: src_dir + "/App.tsx",
        vendor: ["react", "react-dom", "react-router", "redux-thunk", "react-redux", "redux", "lodash", "material-ui",
            "material-design-icons"]
    },
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "[name].js?[hash]"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: [
            path.resolve("./src"),
            "node_modules"
        ]
    },
    module: {
        loaders: [
            {
                test: /\.(tsx|ts)$/,
                loader: "ts-loader",
                exclude: /node_modules/
            }, {
                test: /\.less$/,
                loaders: ["style-loader", "css-loader", "less-loader"],
                exclude: /node_modules/
            }, {
                test: /\.css/,
                loaders: ["style-loader", "css-loader"]
            }, {
                test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
                exclude: /public/,
                loader: "url-loader",
                query: {
                    limit: 5000,
                    name: "[path][name].[ext]",
                    hash: "[hash]"
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "React TypeScript demo"
        }),
        new ExtractTextPlugin("[name].css?[hash]"),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "vendor.bundle.js"
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            sourceMap: false,
            mangle: false
        }),
        new webpack.SourceMapDevToolPlugin({
            test: /\.js/,
            exclude: [
                /vendor\.js/
            ],
            filename: '[file].map[hash]',
            columns: false
        }),
        new webpack.DefinePlugin({
            "process.env": { NODE_ENV: JSON.stringify(nodeEnv) }
        })
    ],
    devServer: {
        contentBase: "./src",
        hot: true
    }
};

module.exports = config;