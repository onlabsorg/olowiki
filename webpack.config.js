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
    use: [ MiniCssExtractPlugin.loader, {loader:"css-loader"} ]
}

const fileRule = {
    test: /\.(woff2|woff|ttf)$/,
    use: [{
        loader: 'file-loader',
        options: {}
    }]
};

const babelRule = {
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
        loader: 'babel-loader',
        options: {
            sourceType: 'unambiguous',
            presets: [['@babel/preset-env', {useBuiltIns: "usage"}]]
        }
    }
};

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const vueLoaderPlugin = new VueLoaderPlugin();
const vueRule = {
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
};


module.exports = {
        
    entry: {
        'olowiki': './src/olowiki.js',
        //'test': './test/index.js'
    },
    
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, 'public')
    },    
    
    module: {
        rules: [ htmlRule, cssRule, fileRule, vueRule]//, babelRule ]
    },

    plugins: [ cssPlugin, vueLoaderPlugin ],  
    
    resolve: {
        alias: {
            "olo-editor": path.resolve(__dirname, "src/olo-editor/"),
            "olo-editor$": path.resolve(__dirname, "src/olo-editor/index"),
        }
    }  
}
