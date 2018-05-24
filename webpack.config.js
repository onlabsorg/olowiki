const path = require('path')

const htmlRule = {
    test: /\.(html)$/,
    use: {
        loader: 'html-loader',
        options: {
            attrs: [':data-src']
        }
    }                    
}


module.exports = {
    
    entry: './src/client.js',
    
    output: {
        filename: 'client.js',
        path: path.resolve(__dirname, 'dist')
    },
    
    module: {
        rules: [ htmlRule ]
    }
}
