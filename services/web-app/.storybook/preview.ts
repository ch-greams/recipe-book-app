
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: 'default',
    values: [
      {
        name: 'default',
        value: '#00bfa5',
      },
      {
        name: 'default-dark',
        value: '#008e76',
      },
      {
        name: 'default-light',
        value: '#5df2d6',
      },
    ],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
