const path = require('path');
const fs = require('fs')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ExtractStyles = new ExtractTextPlugin({filename: 'styles.css'});

module.exports = {
  devServer: {
    https: true,
    key: fs.readFileSync(__dirname+'/ssl/server.key'),
    cert: fs.readFileSync(__dirname+'/ssl/server.crt'),
    ca: fs.readFileSync(__dirname+'/ssl/ca.pem'),
  },
  entry: path.resolve(__dirname,'./src/js/GWatch.js'),
  mode: 'development',
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
        loader: ExtractTextPlugin.extract("css-loader")
    }]
  },
  plugins: [
    ExtractStyles
  ]
};