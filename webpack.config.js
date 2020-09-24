const path = require("path");

// TODO: Use template for HTML and don't reference anything outside "out" folder?

const server = {
    target: "node",
    watch: true,
    //externals: [ "express" ], // NOTE: Consider using webpack-node-externals to reduce bundle size
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
                loader: "source-map-loader"
            },
        ]
    }
};

const client = {
    target: "web",
    watch: true,
    mode: "production",
    entry: {
        "client": path.join(__dirname, "src", "client", "index.tsx")
    },
    output: {
        path: path.resolve(__dirname, "out"),
        filename: "[name]/[name].bundle.js"
    },
    devtool: "source-map",
    resolve: {
        extensions: [ ".ts", ".tsx", ".js", ".svg" ]
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
            }
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};


module.exports = [ server, client ];
