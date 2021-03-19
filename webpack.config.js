const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;
const fileName = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;

module.exports = {  
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: fileName('js'),
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    contentBase: './dist',
    hot: isDev,
    watchOptions: {
      poll: true,
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },      
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({      
      template: 'index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new MiniCssExtractPlugin({
      filename: fileName('css')
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        },
        {
          from: path.resolve(__dirname, 'src/config.json'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    })
  ],
};
