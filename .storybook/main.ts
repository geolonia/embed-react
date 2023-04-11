import path  from "path";
import { StorybookConfig } from '@storybook/react-webpack5'

const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  stories: ["../src/**/*.stories.tsx"],
  // Add any Storybook addons you want here: https://storybook.js.org/addons/
  addons: [
    {
      name: '@storybook/addon-storysource',
      options: {
        rule: {
          include: [path.resolve(__dirname, '../src')]
        },
        loaderOptions: {
          prettierConfig: {
            printWidth: 80,
            singleQuote: true
          }
        }
      }
    },
    "@storybook/addon-mdx-gfm",
  ],
  webpackFinal: async config => {
    config.module?.rules?.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
      include: path.resolve(__dirname, "../")
    });
    config.module?.rules?.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve("babel-loader"),
      options: {
        presets: [["react-app", {
          flow: false,
          typescript: true
        }]]
      }
    });
    config.resolve?.extensions?.push(".ts", ".tsx");
    return config;
  },
};

export default config
