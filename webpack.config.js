module.exports = {
    entry: "./web/static/js/app.js",
    output: {
        path: "./priv/static/js",
        filename: "bundle.js"
    },
    devtool: 'source-map',
    module: {
        loaders: [
	{ test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel' },
	{ test: require.resolve("react"), loader: 'expose?React' },
        ]
    }
};
