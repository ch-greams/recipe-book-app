

module.exports = {
    future: {
        webpack5: true,
    },
    rewrites: async () => ([
        {
            source: "/api/:path*",
            destination: "http://localhost:8080/api/:path*",
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
                    use: ["@svgr/webpack"],
                },
            ],
        },
    }),
};
