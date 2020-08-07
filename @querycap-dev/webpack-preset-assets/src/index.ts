import { IState } from "@querycap-dev/devkit";
import { Configuration } from "webpack";

export const withAssetsPreset = () => (c: Configuration, _2: IState) => {
  c.module?.rules.push(
    {
      test: /\.css$/,
      use: [require.resolve("style-loader"), require.resolve("css-loader")],
    },
    {
      test: /\.md$/,
      use: [require.resolve("html-loader"), require.resolve("markdownit-loader")],
    },
    {
      test: /\.f\.json$/,
      use: [require.resolve("file-loader")],
      type: "javascript/auto",
    },
    {
      test: /\.(eot|woff2?|ttf)$/,
      use: [require.resolve("url-loader")],
    },
    {
      // xxx.raw.svg
      test: /\.raw\.svg$/,
      use: [require.resolve("raw-loader")],
    },
    {
      // xxx.glsl
      test: /\.(glsl|frag|vert)$/,
      use: [require.resolve("glsl-shader-loader")],
    },
    {
      // xxx.svg
      test: /^.*(?<!\.raw)\.svg$/,
      use: [require.resolve("file-loader")],
    },
    {
      // xxx.svga
      test: /\.svga$/,
      use: [require.resolve("file-loader")],
    },
    {
      test: /\.(png|jpg)$/,
      use: [
        {
          loader: require.resolve("file-loader"),
          options: {
            esModule: false,
          },
        },
      ],
    },
  );
};
