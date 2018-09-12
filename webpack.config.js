const path = require('path');

module.exports = {
  entry: path.resolve(__dirname,'./src/js/GWatch.js'),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, "./build/js"),
    filename: 'bundle.js',
    publicPath: "/build/js/",
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
    }]
  }
};