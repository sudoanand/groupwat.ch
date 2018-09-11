const path = require('path');

module.exports = {
  entry: path.resolve(__dirname,'./src/js/index.js'),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, "./build/js"),
    filename: 'bundle.js',
    publicPath: "/build/js/"
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