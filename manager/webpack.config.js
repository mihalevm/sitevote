const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        main: './src/index.js',
        vendor: ['bootstrap', 'crypto', 'crypto-js']
    },

    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },

    resolve: {
        fallback: {
            "crypto": false,
        }
    },

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
            new  HtmlMinimizerPlugin(),
            new CssMinimizerPlugin(),
        ],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: "initial",
                    name: "vendor",
                    test: "vendor",
                    enforce: true
                }
            }
        },
        // runtimeChunk: "single"
    },

    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/index.html", to: "" },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    'style-loader', // for prod
                    //MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
        ]
    },

    devServer: {
        contentBase: './src',
        watchContentBase:true,
        host: 'localhost',
        port: '8080',
        hot: true,
    },
};