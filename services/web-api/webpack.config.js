/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const NodemonPlugin = require("nodemon-webpack-plugin");
const nodeExternals = require("webpack-node-externals");


module.exports = {
    target: "node",
    node: {
        __dirname: false,
    },
    mode: "development",
    entry: { "server": path.join(__dirname, "src", "server", "index.ts") },
    output: {
        path: path.resolve(__dirname, "out/server"),
        filename: "[name].bundle.js",
    },
    devtool: "source-map",
    resolve: {
        alias: {
            "@common": path.resolve(__dirname, "src/common"),
            "@server": path.resolve(__dirname, "src/server"),
        },
        extensions: [ ".ts", ".js" ],
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loader: "ts-loader",
            },
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "source-map-loader",
            },
        ],
    },
    plugins: [ new NodemonPlugin() ],
    externals: [ nodeExternals() ],
};
