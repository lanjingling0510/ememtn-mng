var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: path.join(__dirname, '/src'),
    entry: {
        app: './app/app.js',
        vendor: [
            'angular',
            'angular-ui-router',
            'angular-ui-bootstrap',
            'angular-resource',
            'angular-storage',
            'ng-file-upload',
            'd3'
        ]
    },
    output: {
        path: path.join(__dirname, '/src/app'),
        publicPath: '/app/',
        filename: 'bundle.js'
    },
    externals: {
        jquery: 'jQuery'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'uglify!ng-annotate!babel' },
            { test: /\.less$/, loader: 'style!css!autoprefixer!less'},
            { test: /\.json$/, loader: 'json' },

            { test: /\.html$/, exclude: /node_modules/, loader: 'html!html-minify' },

            { test: /\.(ttf|eot|svg|otf)$/, loader: 'file' },
            { test: /\.woff(2)?$/, loader: 'url?limit=10000&minetype=application/font-woff'}
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
    ]
};
