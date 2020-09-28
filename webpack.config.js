const path = require("path");
const NodemonPlugin = require("nodemon-webpack-plugin");

// TODO: Use template for HTML and don't reference anything outside "out" folder?

const server = {
    target: "node",
    watch: true,
    node: {
        __dirname: false,
    },
    mode: "production",
    entry: { "server": path.join(__dirname, "src", "server", "index.ts") },
    output: {
        path: path.resolve(__dirname, "out"),
        filename: "[name]/[name].bundle.js",
    },
    devtool: "source-map",
    resolve: {
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
    plugins: [
        new NodemonPlugin(),
    ],
    externals: [
        // "express",
        // NOTE: Consider using webpack-node-externals to reduce bundle size
    ],
};

const client = {
    target: "web",
    watch: true,
    mode: "production",
    entry: {
        "client": path.join(__dirname, "src", "client", "index.tsx"),
    },
    output: {
        path: path.resolve(__dirname, "out"),
        filename: "[name]/[name].bundle.js",
        chunkFilename: "[name]/[name].bundle.js",
    },
    devtool: "source-map",
    resolve: {
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
    },
};


module.exports = [ server, client ];
