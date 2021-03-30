const path = require( 'path' );
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    devtool: 'source-map',

    // bundling mode
    mode: 'production',

    // entry files
    entry: './src/main.ts',

    // output bundles (location)
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'bundle.js',
    },

    // file resolutions
    resolve: {
        extensions: [ '.ts', '.js' ],
    },

      // loaders
      module: {
        rules: [
            {
                test: /\.tsx?/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'assets/resource',
              },
              {
                test: /\.(woff|woff2|eot|ttf|otf|obj)$/i,
                type: 'assets/resource',
              },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: './src/index.html'
        })
      ],

    // set watch mode to `true`
    watch: true
};