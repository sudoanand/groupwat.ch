const path = require('path');
const fs = require('fs')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ExtractStyles = new ExtractTextPlugin({filename: 'styles.css'});

module.exports = {
  devServer: {
    https: true,
  },
  entry: path.resolve(__dirname,'./src/js/GWatch.js'),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, "./dist/"),
    filename: 'bundle.js',
    publicPath: "/dist/",
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
        loader: ExtractTextPlugin.extract("css-loader")
    }]
  },
  plugins: [
    ExtractStyles
  ]
};


console.log("NOTE : \n - This project requires HTTPS   \n - Even the dev-server is running on HTTPS  \n - You need to accept the unsecure SSL warning \n - Not mandatory, but if you wish to remove the warning, have a look at webpack.dev.js\n\n");