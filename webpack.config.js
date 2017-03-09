var webpack = require('webpack');

module.exports = {
	entry: "./src/viewmodel.js",
	output: {
		filename: "dist/bundle.js"
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