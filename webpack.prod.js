const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ExtractStyles = new ExtractTextPlugin({filename: 'styles.css'});
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname,'./src/js/GWatch.js'),
  mode: 'production',
  output: {
    path: path.resolve(__dirname, "./build/"),
    filename: 'bundle.js',
    publicPath: "/build/",
    libraryTarget: 'var',
    library: 'GWatch'
  },
  externals: {
    'jquery':'$',
    'video.js':'videojs'
  },
  module: {
    rules: [{ 
      test: /\.js$/, 
      exclude: /node_modules/, 
      loader: "babel-loader",
      query : {
      	presets :['env']
      }
    },{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ loader: 'css-loader', options: { minimize: true }} )
    }]
  },
  plugins: [
    ExtractStyles,
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    })
  ]
};