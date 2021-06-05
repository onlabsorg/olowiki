
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    
    plugins: [new MiniCssExtractPlugin()],
        
    entry: {
        'dist/vue-olo-editor': './index.js',
        'test/dist/vue-olo-editor-test': './test/main.js'
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
