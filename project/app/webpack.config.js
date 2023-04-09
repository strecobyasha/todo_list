const path = require('path');
var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');

var config = {
    module: {},
};

function Conf(entryFile, outputFile) {
    return ({
        entry: './static/js/' + entryFile,
        output: {
            path: `${__dirname}/static/js/` + 'bundle',
            filename: outputFile
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react']
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new CompressionPlugin({
                algorithm: "gzip",
                test: /\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0.8
            }),
        ]
    })
};

var todo = Object.assign({}, config, Conf('todo.js', 'todo.js'));

module.exports = [todo]
