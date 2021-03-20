const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;
const fileName = ext => isDev ? `[name].bundle.${ext}` : `[name].bundle.[fullhash].${ext}`;

module.exports = {  
  mode: 'development',
  entry: {
    index: './src/index.js',
    bootstrap: './src/js/bootstrap.js',
    jquery: './src/js/jquery.js',
  },
  output: {
    filename: fileName('js'),
    path: path.resolve(__dirname, 'dist/'),
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
        test: /\.(scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: function () {
                  return [
                    require('precss'),
                    require('autoprefixer')
                  ];
                }
              }
            }
          },
          { loader: 'sass-loader' }
        ]
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
          from: path.resolve(__dirname, 'src/config/config.json'),
          to: path.resolve(__dirname, 'dist/config')
        },        
        {
          from: path.resolve(__dirname, 'src/pages/'),
          to: path.resolve(__dirname, 'dist/pages')
        },
        {
          from: path.resolve(__dirname, 'src/img/'),
          to: path.resolve(__dirname, 'dist/img')
        }
      ]
    })
  ],
};
