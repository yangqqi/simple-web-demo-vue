module.exports = {
  publicPath: './',
  // runtimeCompiler: true,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(js|vue)$/,
          loader: "language-tw-loader",
        },
      ],
    },
  },
};
