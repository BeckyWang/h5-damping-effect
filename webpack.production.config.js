const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const port = 8088;
const host = `http://localhost:${port}/`;

module.exports = {
    entry: {
        index: './src/index.js'
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
            use: ExtractTextPlugin.extract({
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
            use: ['style-loader', 'css-loader']
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
        new ExtractTextPlugin('css/index.css'),
        new CopyWebpackPlugin([{
            from: 'node_modules/jquery/dist/jquery.min.js',
            to: 'lib/'
        }]),
        new HtmlwebpackPlugin({
            template: 'src/index.html',
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: [
                'lib/index.css',
                'lib/jquery.min.js'
            ],
            append: false
        })
    ]
};