// @ts-check
const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");


/** @type {import("redocusaurus").PresetEntry} */
const redocusaurus = [
    "redocusaurus",
    ({
        specs: [
            {
                spec: 'openapi/web-api.yaml',
                route: '/web-api/',
            },
            {
                spec: 'openapi/auth-api.yaml',
                route: '/auth-api/',
            },
        ],
        theme: {
            options: {
                disableSearch: true,
                hideDownloadButton: true,
            },
        },
    }),
];

/** @type {import("@docusaurus/types").Config} */
const config = {
    title: "Recipe Book App",
    tagline: "Cooking is fun",
    url: "https://recipebook.greams.be",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon.ico",

    // GitHub pages deployment config.
    organizationName: "ch-greams",
    projectName: "recipe-book-app",

    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },

    presets: [
        [
            "classic",
            /** @type {import("@docusaurus/preset-classic").Options} */
            ({
                docs: {
                    sidebarPath: require.resolve("./sidebars.js"),
                    // editUrl: "https://github.com/ch-greams/recipe-book-app/tree/develop/services/docs-app/",
                },
                blog: {
                    showReadingTime: true,
                    // editUrl: "https://github.com/ch-greams/recipe-book-app/tree/develop/services/docs-app/",
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
            }),
        ],
        // @ts-ignore
        redocusaurus,
    ],

    themeConfig:
        /** @type {import("@docusaurus/preset-classic").ThemeConfig} */
        ({
            navbar: {
                title: "RecipeBook",
                logo: {
                    alt: "RecipeBook Logo",
                    src: "img/logo.svg",
                },
                items: [
                    {
                        type: "doc",
                        docId: "intro",
                        position: "left",
                        label: "Documentation",
                    },
                    {
                        to: "/web-api",
                        label: "WEB-API",
                        position: "left",
                    },
                    {
                        to: "/auth-api",
                        label: "AUTH-API",
                        position: "left",
                    },
                    {
                        to: "/blog",
                        label: "Blog",
                        position: "left",
                    },
                    {
                        href: "https://github.com/ch-greams/recipe-book-app",
                        label: "GitHub",
                        position: "right",
                    },
                ],
            },
            footer: {
                style: "dark",
                links: [
                    {
                        title: "Docs",
                        items: [
                            {
                                label: "Tutorial",
                                to: "/docs/intro",
                            },
                        ],
                    },
                    {
                        title: "Community",
                        items: [
                            {
                                label: "Discord",
                                href: "https://discordapp.com/invite/recipebook-greams",
                            },
                            {
                                label: "Twitter",
                                href: "https://twitter.com/recipebook-greams",
                            },
                        ],
                    },
                    {
                        title: "More",
                        items: [
                            {
                                label: "Blog",
                                to: "/blog",
                            },
                            {
                                label: "GitHub",
                                href: "https://github.com/ch-greams/recipe-book-app",
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Greams, Inc.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
