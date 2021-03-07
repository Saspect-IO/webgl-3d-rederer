const path = require( 'path' );

module.exports = {

    devtool: 'source-map',

    // bundling mode
    mode: 'production',

    // entry files
    entry: './src/main.ts',

    // output bundles (location)
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'main.js',
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
                type: 'asset/resource',
              },
              {
                test: /\.(woff|woff2|eot|ttf|otf|obj)$/i,
                type: 'asset/resource',
              },
        ]
    },

    // set watch mode to `true`
    watch: true
};