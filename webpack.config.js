const webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = [
    {
        entry: __dirname + '/client/index.js',
        output: {
            path: __dirname + '/client/dist',
            publicPath: '/client/dist/',
            filename: 'client_bundle.js'
        },
        target: 'web',
        devtool: "source-map",
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    exclude: /node_modules/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.html$/i,
                    exclude: /node_modules/,
                    loader: 'html-loader',
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                }
            ]
        },
        
    },
    {
        entry: __dirname + '/server/server.js',
        output: {
            path: __dirname + '/server/dist',
            publicPath: '/server/dist/',
            filename: 'server_bundle.js'
        },
        target: 'node',
        externals: [nodeExternals()],
        devtool: "source-map",
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                }
            ]
        },
        plugins: [
            new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false
        })
        ],
    },
   

]
