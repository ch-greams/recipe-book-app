

module.exports = {
    rewrites: async () => ([
        {
            source: "/auth/api/:path*",
            destination: `http://${process.env.RB__AUTH_API_ADDR || "127.0.0.1:3003"}/api/:path*`,
            basePath: false,
        },
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
                    issuer: /\.tsx$/,
                    use: [ "@svgr/webpack" ],
                },
            ],
        },
    }),
};
