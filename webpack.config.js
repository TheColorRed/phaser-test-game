var path = require('path');
var webpack = require('webpack');

var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    loaders: [
      { test: /pixi.js/, loader: "script" },
    ],
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/js')
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    // alias: {
    //   'phaser': phaser,
    //   'pixi.js': pixi,
    //   'p2': p2,
    // }
  }
}