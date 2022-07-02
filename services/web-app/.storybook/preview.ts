
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: 'default',
    values: [
      {
        name: 'default',
        value: '#43a047',
      },
      {
        name: 'default-dark',
        value: '#00701a',
      },
      {
        name: 'default-light',
        value: '#76d275',
      },
      {
        name: 'white',
        value: '#fff',
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
