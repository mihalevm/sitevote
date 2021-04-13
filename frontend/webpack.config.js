const webpack = require("webpack");
const path = require('path');
const glob = require('glob-all');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;
const fileName = ext => isDev ? `[name].bundle.${ext}` : `[name].bundle.[fullhash].${ext}`;

module.exports = {  
  mode: 'development',  
  entry: {    
    'index' : './src/index.js',    
    'profile': './src/js/profile.js',
    'profile-add-edit-site': './src/js/profile-add-edit-site.js',
    // 'select-site': './src/js/select-site.js',    
    'vote': './src/js/vote.js',
    'share': './src/vendors/share.js'
  },  
  output: {
    filename: `scripts/${fileName('js')}`,
    path: path.resolve(__dirname, 'dist/'),
    clean: true,
  },
  resolve: {
    fallback: {
      "crypto": false,
    }
  },
  optimization: {    
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        styles: {
          name: 'style',
          test: /\.scss$/,
          chunks: 'all',
          enforce: true
        },
        // vendor: {
        //   test: /[\\/]node_modules[\\/]/,
        //   name(module) {
        //     const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]; 
        //     return `npm.${packageName.replace('@', '')}`;
        //   },
        // },
      }     
    },
  },  
  devtool: isDev ? 'source-map' : false,
  devServer: {     
    contentBase: './dist',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.(scss)$/,
        use: [
          MiniCssExtractPlugin.loader,        
        { loader: 'css-loader'  },
        { loader: 'postcss-loader' },
        { loader: 'sass-loader'  }
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
      },
      inject: 'body',
      chunks: ['index']      
    }),
    new HtmlWebpackPlugin({      
      template: './src/pages/profile.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      },
      inject: 'body',
      chunks: ['share','profile'],
      filename: 'pages/profile.html'
    }),
    // new HtmlWebpackPlugin({      
    //   template: './src/pages/select-site.html',
    //   minify: {
    //     removeComments: isProd,
    //     collapseWhitespace: isProd
    //   },
    //   inject: 'body',
    //   chunks: ['select-site'],
    //   filename: 'pages/select-site.html'
    // }),
    new HtmlWebpackPlugin({      
      template: './src/pages/profile-add-edit-site.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      },
      inject: 'body',
      chunks: ['profile-add-edit-site'],
      filename: 'pages/profile-add-edit-site.html'
    }),
    new HtmlWebpackPlugin({      
      template: './src/pages/vote.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      },
      inject: 'body',
      chunks: ['share','vote'],
      filename: 'pages/vote.html'
    }),
    new MiniCssExtractPlugin({
      filename: `styles/${fileName('css')}`
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
          from: path.resolve(__dirname, 'src/img'),
          to: path.resolve(__dirname, 'dist/img')
        },  
      ]
    }),    
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',      
    }),
    new PurgeCSSPlugin({
      paths: glob.sync([
        './src/index.js',
        './index.html',
        './src/js/*.js',
        './src/js/templates/*.js',
        './src/pages/*.html'
      ])
    }),
    // new BundleAnalyzerPlugin()
  ],
};


