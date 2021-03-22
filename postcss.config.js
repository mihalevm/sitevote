module.exports = {
  plugins: [
    [
      "postcss-preset-env",
      require('precss'),
      require('autoprefixer'),
    ],
  ],
};
