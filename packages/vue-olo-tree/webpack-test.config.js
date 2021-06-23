
const pathlib = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {VueLoaderPlugin} = require('vue-loader');


module.exports = {
    
    plugins: [new MiniCssExtractPlugin(), new VueLoaderPlugin()],
        
    entry: {
        'vue-olo-tree-test': './test/client.js'
    },
    
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: pathlib.join(__dirname, 'test/dist')
    },    
    
    module: {
        rules: [
            
            {
                test: /\.(html)$/,
                loader: 'html-loader',
            },
            
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            
            {
                test: /\.(woff2|woff|ttf|svg)$/,
                loader: 'file-loader',
                options: {
                    name: "[name].[ext]"
                }
            },
            
            {
                // vue-loader config to load `.vue` files or single file components.
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // https://vue-loader.vuejs.org/guide/scoped-css.html#mixing-local-and-global-styles
                        css: ['vue-style-loader', {
                            loader: 'css-loader',
                        }],
                        // js: [
                        //     'babel-loader',
                        // ],
                    },
                    cacheBusting: true,
                }
            },
        ],
    },
}
