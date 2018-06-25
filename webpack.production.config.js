const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SCSSExtract = new ExtractTextPlugin('css/index.css');
const CSSExtract = new ExtractTextPlugin('css/iframe.css');

const port = 8087;
const host = `http://localhost:${port}/`;

module.exports = {
    entry: {
        index: './src/js/index.js',
        iframe: './src/js/iframe.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
        publicPath: host
    },

    module: {
        rules: [{
            test: /\.js?$/,
            include: [path.resolve(__dirname, 'src')],
            enforce: 'post',
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                    plugins: ['transform-object-rest-spread', 'syntax-dynamic-import'],
                }
            }]
        }, {
            test: /\.html$/,
            use: ['html-loader']
        }, {
            test: /\.scss$/,
            include: [path.resolve(__dirname, 'src')],
            use: SCSSExtract.extract({
                fallback: 'style-loader',
                use: ['css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [
                            require('cssnano')({
                                preset: 'default',
                            }),
                            require('autoprefixer')({ browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8'] })
                        ]
                    }
                }, 'sass-loader']
            })
        }, {
            test: /\.css$/,
            use: CSSExtract.extract({
                fallback: 'style-loader',
                use: ['css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [
                            require('cssnano')({
                                preset: 'default',
                            }),
                            require('autoprefixer')({ browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8'] })
                        ]
                    }
                }, 'sass-loader']
            })
        }, {
            test: /\.(?:png|jpg|gif|svg)$/,
            use: 'url-loader?limit=8192&name=images/[hash].[ext]'
        }]
    },

    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src'),
        ],
        extensions: ['.js', '.json', '.scss']
    },

    context: __dirname,

    externals: {
        'jquery': 'window.jQuery',
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            beautify: false,
            comments: false,
            compress: {
                warnings: false,
                drop_console: true,
                collapse_vars: true,
                reduce_vars: true
            }
        }),
        SCSSExtract,
        CSSExtract,
        new CopyWebpackPlugin([{
            from: 'node_modules/jquery/dist/jquery.min.js',
            to: 'lib/'
        }, {
            from: './src/images/iframe',
            to: 'images/iframe/'
        }]),
        new HtmlwebpackPlugin({
            template: 'src/index.html',
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: [
                'css/index.css',
                'lib/jquery.min.js'
            ],
            append: false
        })
    ]
};