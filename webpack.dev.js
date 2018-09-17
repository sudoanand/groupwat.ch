const path = require('path');
const fs = require('fs')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ExtractStyles = new ExtractTextPlugin({filename: 'styles.css'});

module.exports = {
  devServer: {
    https: true,
   

   /**
    * Use following setttings if you wish to use self-signed certificates for the localhost dev-server
    * For a guide on how to generate self signed-ssl certs for localhost
    * See: https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec
    */

    // key: fs.readFileSync(__dirname+'/path/to/server.key'),
    // cert: fs.readFileSync(__dirname+'/path/to/server.crt'),
    // ca: fs.readFileSync(__dirname+'/path/to/ca.pem'),
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


console.log("NOTE : \n - This project requires HTTPS   \n - Even the dev-server is running on HTTPS  \n - You need to accept the unsecure SSL warning \n - Not mandatory, but if you wish to remove the warning, have a look at webpack.dev.js\n\n");