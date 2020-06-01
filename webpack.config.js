const path = require("path");

const config = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "tizenproject"),
  },
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    // inline to ensure Tizen compilation includes the map
    config.devtool = "inline-source-map";
  }

  return config;
};
