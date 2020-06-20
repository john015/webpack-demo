const webpack = require("webpack");
const path = require("path");
const TerserJSPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (webpackEnv) => {
  const isEnvProduction = webpackEnv === "production";
  const isEnvDevelopment = webpackEnv === "development";

  return {
    mode: isEnvProduction ? "production" : "development",
    entry: "./src",
    output: {
      filename: isEnvProduction
        ? "static/js/[name].[contenthash].js"
        : "static/js/bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react", "@babel/preset-typescript"],
            },
          },
        },
      ],
    },
    resolve: {
      modules: ["node_modules"],
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
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
        open: true,
        host: "localhost",
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, "dist"),
      },
    }),
  };
};
