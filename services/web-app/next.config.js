

module.exports = {
    rewrites: async () => ([
        {
            source: "/auth/api/:path*",
            destination: `${process.env.RB__AUTH_API_ADDR}/api/:path*`,
            basePath: false,
        },
        {
            source: "/api/:path*",
            destination: `${process.env.RB__API_ADDR}/api/:path*`,
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
