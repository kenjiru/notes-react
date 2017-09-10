const CordovaPlugin = require("webpack-cordova-plugin");
const merge = require("webpack-merge");

const base = require("../webpack.config");
const ENV = getEnv();

const common = {
    plugins: [
        new CordovaPlugin({
            config: "config.xml",  // Location of Cordova" config.xml (will be created if not found)
            src: ENV === "development" ? "http://10.0.2.2:8080" : "index.html",     // Set entry-point of cordova in config.xml
            platform: "android",  // Set `webpack-dev-server` to correct `contentBase` to use Cordova plugins.
            version: false         // Set config.xml" version. (true = use version from package.json)
        })
    ]
};

if (ENV === "development") {
    module.exports = merge(base, common, {
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            // Parse host and port from env so this is easy to customize.
            host: process.env.HOST,
            port: process.env.PORT
        }
    });
} else {
    module.exports = merge(base, common, {
        output: {
            publicPath: "./"
        }
    });
}

function getEnv() {
    const TARGET = process.env.npm_lifecycle_event;
    let env = "build";

    switch (TARGET) {
        case "cordova-start":
        case "cordova-android":
            env = "development";
    }

    return env;
}