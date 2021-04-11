const path = require("path");
const NodemonPlugin = require("nodemon-webpack-plugin");
const nodeExternals = require("webpack-node-externals");


const server = {
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
            "@client": path.resolve(__dirname, "src/client"),
            "@server": path.resolve(__dirname, "src/server"),
            "@api": path.resolve(__dirname, "src/api"),
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

const client = {
    target: "web",
    mode: "development",
    entry: {
        "client": path.join(__dirname, "src", "client", "index.tsx"),
    },
    output: {
        path: path.resolve(__dirname, "out/client"),
        filename: "[name].bundle.js",
        chunkFilename: "chunk-[name].bundle.js",
        publicPath: "/",
    },
    devtool: "source-map",
    resolve: {
        alias: {
            "@common": path.resolve(__dirname, "src/common"),
            "@client": path.resolve(__dirname, "src/client"),
            "@server": path.resolve(__dirname, "src/server"),
            "@api": path.resolve(__dirname, "src/api"),
        },
        extensions: [ ".ts", ".tsx", ".js", ".svg" ],
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loader: "ts-loader",
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                loader: "@svgr/webpack",
            },
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "source-map-loader"
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                mode: "local",
                                localIdentName: "[name]_[local]",
                            },
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: { sourceMap: true },
                    },
                ],
            },
        ],
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "redux": "Redux",
        "react-router-dom": "ReactRouterDOM",
        "react-redux": "ReactRedux",
        "redux-saga": "ReduxSaga",
        "styled-components": "styled",
    },
};


module.exports = [ server, client ];
