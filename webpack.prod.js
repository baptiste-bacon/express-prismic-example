const path = require("path");

const { request } = require("express");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  devtool: false,
  output: {
    path: path.join(__dirname, "public"),
  },
});
