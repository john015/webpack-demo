const webpack = require("webpack");
const path = require("path");
const TerserJSPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (webpackEnv) => {
  const isEnvDevelopment = webpackEnv === "development";

  return {
    mode: isEnvDevelopment ? "development" : "production",
    entry: "./src/index.tsx",
    output: {
      filename: "static/js/[name].[contenthash:8].js",
      path: path.resolve(__dirname, "dist"),
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: { presets: ["@babel/preset-env", "@babel/preset-react"] },
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "public/index.html",
        minify: {
          collapseWhitespace: true,
        },
        hash: true,
      }),
    ],
    optimization: {
      minimizer: [new TerserJSPlugin({ sourceMap: true })],
    },
    ...(isEnvDevelopment && {
      devServer: {
        hot: true,
        host: "localhost",
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, "dist"),
      },
    }),
  };
};
