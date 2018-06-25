const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const OpenBrowerPlugin = require('open-browser-webpack-plugin');

const port = 8088;
const host = `http://localhost:${port}/`;

module.exports = {
    entry: {
        index: './src/js/index.js'
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
                    presets: ['es2017'],
                    plugins: ['transform-object-rest-spread', 'syntax-dynamic-import'],
                }
            }]
        }, {
            test: /\.html$/,
            use: ['html-loader']
        }, {
            test: /\.scss$/,
            include: [path.resolve(__dirname, 'src')],
            use: ['style-loader', 'css-loader', {
                loader: 'postcss-loader',
                options: {
                    plugins: () => [
                        require('autoprefixer')({ browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8'] })
                    ]
                }
            }, 'sass-loader']
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.(?:png|jpg|gif|svg)$/,
            use: 'url-loader?limit=8192&name=image/[hash].[ext]' //小于8k,内嵌;大于8k生成文件
        }]
    },

    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src'),
        ],
        extensions: ['.js', '.json', '.scss']
    },

    devtool: 'eval-source-map',

    context: __dirname,

    devServer: {
        proxy: { // proxy URLs to backend development server
            '/images': 'http://localhost:8000',
            '/learning/api/v1': 'http://localhost:8000',
        },
        contentBase: [path.join(__dirname, 'dist')],
        compress: true, // enable gzip compression
        historyApiFallback: true, // true for index.html upon 404, object for multiple paths
        hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
        port: port
    },

    externals: {
        'jquery': 'window.jQuery',
    },

    plugins: [
        new CopyWebpackPlugin([{
            from: 'node_modules/jquery/dist/jquery.min.js',
            to: 'lib/'
        }]),
        new HtmlwebpackPlugin({
            template: 'src/index.html',
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: [
                'lib/jquery.min.js'
            ],
            append: false
        }),
        new OpenBrowerPlugin({
            url: host
        })
    ]
};