

module.exports = {
    rewrites: async () => ([
        {
            source: "/api/:path*",
            destination: "http://recipe-book-api:8080/api/:path*",
            basePath: false,
        },
    ]),
    webpack: (config) => ({
        ...config,
        module: {
            ...config.module,
            rules: [
                ...config.module.rules,
                {
                    test: /\.svg$/,
                    use: [ "@svgr/webpack" ],
                },
            ],
        },
    }),
};
