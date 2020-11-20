const webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = [
	{
		entry: __dirname + '/client/index.js',
		output: {
			path: __dirname + '/client/dist',
			publicPath: '/client/dist/',
			filename: 'client_bundle.js',
		},
		target: 'web',
		devtool: 'source-map',
		plugins: [new CompressionPlugin({ compressionOptions: { level: 9 } })],
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
				},
				{
					test: /\.(png|jpg|gif|webm|mp3)$/i,
					use: [
						{
							loader: 'url-loader',
						},
					],
				},
				{
					test: /\.svg$/,
					use: [
						{
							loader: 'svg-url-loader',
							options: {
								limit: 10000,
							},
						},
					],
				},
			],
		},
	},
	{
		entry: __dirname + '/server/server.js',
		output: {
			path: __dirname + '/server/dist',
			publicPath: '/server/dist/',
			filename: 'server_bundle.js',
		},
		target: 'node',
		externals: [nodeExternals()],
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
				},
			],
		},
		plugins: [
			new webpack.BannerPlugin({
				banner: 'require("source-map-support").install();',
				raw: true,
				entryOnly: false,
			}),
			new NodemonPlugin({
				// If using more than one entry, you can specify
				// which output file will be restarted.
				script: './server/dist/server_bundle.js',

				// What to watch.
				watch: [path.resolve('./server'), path.resolve('./client')],

				// Files to ignore.
				ignore: ['*.js.map'],

				// Extensions to watch.
				ext: 'js,html,css',

				// Unlike the cli option, delay here is in milliseconds (also note that it's a string).
				// Here's 1 second delay:
				delay: '100',

				// Detailed log.
				verbose: false,
			}), // Dong
		],
	},
];
