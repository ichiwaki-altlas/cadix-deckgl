const resolve = require('path').resolve;
const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'ts-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'url-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    alias: {
      'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    //   'process.env.MapboxAccessToken': JSON.stringify(process.env.MapboxAccessToken || process.env.MAPBOX_TOKEN)
    // }),
    new Dotenv(),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    client: { overlay: false, },
    allowedHosts: 'all',
    hot: true,
    compress: true,
    host: '0.0.0.0',
    port: 3001
  }
};
