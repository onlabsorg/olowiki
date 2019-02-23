const path = require('path');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const cssPlugin = new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "[name].css",
    chunkFilename: "[id].css"
});


const htmlRule = {
    test: /\.(html)$/,
    use: {
        loader: 'html-loader',
        options: {
            attrs: [':data-src']
        }
    }                    
}

const cssRule = {
    test: /\.css$/,
    use: [ MiniCssExtractPlugin.loader, {loader:"css-loader", options:{minimize:true}} ]
}


module.exports = {
        
    entry: './test/test.js',
    
    output: {
        filename: 'main.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'test')
    },    
    
    module: {
        rules: [ htmlRule, cssRule ]
    },

    plugins: [ cssPlugin ],    
}
