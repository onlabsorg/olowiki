const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {VueLoaderPlugin} = require('vue-loader')


module.exports = {
        
    entry: {
        'olowiki': './src/index.js',
    },
    
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },    
    
    module: {
        rules: [ 
            
            {// babel rule
                test: /\.m?js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            '@babel/plugin-proposal-optional-chaining',
                            '@babel/plugin-syntax-dynamic-import'
                        ]
                    }
                }
            },
            
            {// html rule
                test: /\.(html)$/,
                loader: 'html-loader',
            },
            
            {// css rule
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },

            {// file rule
                test: /\.(woff2|woff|ttf|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: "[name].[ext]"
                    }
                }]
            },

            {// vue-loader config to load `.vue` files or single file components.
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
            }
        ]
    },

    plugins: [ 
        new MiniCssExtractPlugin(), 
        new VueLoaderPlugin() 
    ]  
}
