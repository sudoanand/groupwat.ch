const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = function(env){

const env_mode = env ? env.mode || "none":"none";
if(env_mode=="development") console.log("NOTE : \n - This project requires HTTPS   \n - Even the dev-server is running on HTTPS  \n - You need to accept the unsecure SSL warning\n\n");


 return {
    devServer: {
      https:true
    },
    entry: {
      "bundle": "./src/js/GWatch.js",
      "bundle.min": "./src/js/GWatch.js",
    },
    mode: env_mode,
    output: {
      path: path.resolve(__dirname, "./dist/"),
      filename: 'js/[name].js',
      publicPath: "/dist/",
      libraryTarget: 'var',
      library: 'GWatch'
    },
    externals: {
      'jquery':'$',
      'video.js':'videojs'
    },
    optimization: {
      minimize: true,
      minimizer: [new UglifyJsPlugin({
        test: /\.min\.js$/i
      })]
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader",  query : { presets :['env'] } },
        { test: /\.css$/, loader: ExtractTextPlugin.extract("css-loader") }
      ]
    },
    plugins: [
      new ExtractTextPlugin({filename: 'css/styles.css'}),

      new ExtractTextPlugin({filename: 'css/styles.min.css'}),

      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.min\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true
      })
    ]
  }
};