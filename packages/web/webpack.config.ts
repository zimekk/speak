import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import webpack from "webpack";
import env from "dotenv";

env.config({ path: path.resolve(__dirname, "../../.env") });

const dev = process.env.NODE_ENV === "development";

const config: webpack.Configuration = {
  devServer: {
    port: 8080,
  },
  entry: require.resolve("./src"),
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sassOptions: {
                fiber: require("fibers"),
              },
            },
          },
        ],
      },
      {
        test: /\.(gltf|mtl|obj|png)$/,
        use: ["file-loader"],
      },
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react", "@babel/preset-typescript"],
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: { fs: false, util: false },
  },
  output: {
    path: path.resolve(__dirname, "public"),
  },
  plugins: [
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new HtmlWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        // https://github.com/webpack/webpack/issues/6586
        // https://github.com/gridsome/gridsome/issues/1206
        {
          context: path.resolve(__dirname, "src/audio-model"),
          from: "*.*",
          to: "audio-model",
        },
        {
          context: path.resolve(__dirname, "src/api"),
          from: "*.json",
          to: "api",
        },
      ],
    }),
  ],
};

export default config;
