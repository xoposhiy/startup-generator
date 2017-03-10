var webpack = require('webpack');
var path = require('path');

module.exports = {
	devtool: "source-map",
	entry: "./src/viewmodel.js",
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		port: 9000
	},
	plugins: [
		new webpack.DefinePlugin({
		  'process.env': {
			NODE_ENV: '"production"'
		  }
		})
	],
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
		]
	},
	resolve: {
		alias: {
		  'vue$': 'vue/dist/vue.esm.js'
		}
	}
};