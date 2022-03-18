

module.exports = {
    rewrites: async () => ([
        {
            source: "/api/:path*",
            destination: `http://${process.env.RB__API_ADDR || "127.0.0.1:8080"}/api/:path*`,
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
