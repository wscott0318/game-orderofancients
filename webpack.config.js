
const path = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

//

const plugins = [
    new webpack.SourceMapDevToolPlugin({
        filename: '[name].js.map',
        exclude: ['vendor.bundle.js']
    })
];

//

module.exports = conf = {
    devtool: false,
    mode: 'development',
    watchOptions: {
        poll: 500
    },
    entry: {
        worker: './src/game/worker/GameWorker.ts'
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
        plugins: [new TsconfigPathsPlugin({
            configFile: './tsconfig.json',
            extensions: ['.ts', '.js']
        })]
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.json',
                        onlyCompileBundledFiles: true
                    }
                }],
                exclude: [ /node_modules/ ]
            }
        ]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    plugins
};
