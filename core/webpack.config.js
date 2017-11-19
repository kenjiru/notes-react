const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const nodeEnv = process.env.NODE_ENV || "development";

const config = {
    devtool: buildDep("cheap-module-eval-source-map"),
    cache: true,
    context: __dirname,
    output: {
        publicPath: "/",
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
            }, {
                test: /\.(less$|css)/,
                use: ExtractTextPlugin.extract({
                    fallback: {
                        loader: "style-loader",
                        options: {
                            sourceMap: false
                        }
                    },
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: false
                            }
                        },
                        {
                            loader: "less-loader",
                            options: {
                                sourceMap: false
                            }
                        }
                    ]
                })
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
            title: "Notes",
            chunks: ["app", "vendor"],
            template: require("html-webpack-template"),
            scripts: [
                "./cordova.js"
            ],
            inject: false
        }),
        new HtmlWebpackPlugin({
            title: "Dropbox Auth",
            chunks: ["dropboxAuth", "vendor"],
            filename: "dropbox-auth.html"
        }),
        new ExtractTextPlugin({
            filename: "[name].css?[contenthash]",
            allChunks: true,
            disable: buildDep(true)
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ["vendor"],
            filename: "[name].js?[hash]"
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
            sourceMap: buildDep(true, false),
            mangle: buildDep(false, true)
        }),
        new webpack.SourceMapDevToolPlugin({
            test: /\.js/,
            exclude: [
                /vendor\.js/
            ],
            filename: '[file].map?[hash]',
            columns: false
        }),
        new webpack.DefinePlugin({
            "process.env": {NODE_ENV: JSON.stringify(nodeEnv)}
        })
    ],
    devServer: {
        contentBase: "./",
        hot: true,
        stats: "errors-only"
    }
};

function buildDep(devValue, prodValue) {
    return isDevelopment() ? devValue : prodValue;
}

function isDevelopment() {
    return nodeEnv === "development";
}

module.exports = config;