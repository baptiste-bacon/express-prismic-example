const path = require("path");
const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const IS_DEVELOPMENT = process.env.NODE_ENV === "dev";

const dirSrc = path.join(__dirname, "src");
const dirStyles = path.join(dirSrc, "styles");
const dirImages = path.join(dirSrc, "images");
const dirVideos = path.join(dirSrc, "videos");
const dirNode = "node_modules";

module.exports = {
  entry: [
    path.join(dirSrc, "index.js"),
    path.join(dirSrc, "styles", "index.scss"),
  ],
  resolve: {
    modules: [dirSrc, dirStyles, dirImages, dirVideos, dirNode],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "public"),
    clean: true,
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),

    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  module: {
    rules: [
      //JS
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
        },
      },

      //SCSS
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "",
            },
          },
          { loader: "css-loader" },
          { loader: "postcss-loader" },
          { loader: "sass-loader" },
        ],
      },

      //Assets
      {
        test: /\.(png|svg|jpg|jpeg|gif|fnt|webp|woff2?|)$/,
        loader: "file-loader",
        options: {
          name(file) {
            return "[hash].[ext]";
          },
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              severityError: "warning", // Ignore errors on corrupted images
              minimizerOptions: {
                plugins: ["gifsicle"],
              },
            },
          },
        ],
      },
      //Shaders
      {
        test: /\.(glsl|frag|vert)$/,
        loader: "raw-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: "glslify-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
