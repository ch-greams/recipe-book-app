const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
    stories: [
        "../views/**/*.stories.tsx",
    ],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "storybook-addon-next",
    ],
    framework: "@storybook/react",
    core: {
        builder: "@storybook/builder-webpack5",
    },
    typescript: {
        // NOTE: Currently both docgen addons are fucked
        reactDocgen: false,
    },
    webpackFinal: async (config) => ({
        ...config,
        resolve: {
            ...config.resolve,
            plugins: [ new TsconfigPathsPlugin() ],
        },
    }),
};
