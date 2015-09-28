module.exports = {
    entry: "./web/static/js/index.js",
    output: {
        path: "./priv/static/js",
        filename: "bundle.js"
    },
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel' },
            { test: /\.css$/, loader: "style-loader!css-loader" },
	    { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
            { test: require.resolve("react"), loader: 'expose?React' },
        ]
    }
};
