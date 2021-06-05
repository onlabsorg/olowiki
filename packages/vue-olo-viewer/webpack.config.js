
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    
    plugins: [new MiniCssExtractPlugin()],
        
    entry: {
        'dist/vue-olo-viewer': './index.js',
        'test/dist/vue-olo-viewer-test': './test/main.js'
    },
    
    output: {
        filename: '[name].js',
        chunkFilename: 'dist/[name].js',
        path: __dirname
    },    
    
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
}
