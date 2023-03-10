const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd
const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ]

  if (isDev) {
    loaders.push('eslint-loader')
  }

  return loaders
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['@babel/polyfill', './script.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),

  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    allowedHosts: ['all'],

    compress: true,
    port: 9000,
  },
  plugins: [
    new CleanWebpackPlugin(),

    new HTMLWebpackPlugin({

      template: 'script.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist'),
        }],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ],
  module: {
    rules: [

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
        ],

      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },

    ],
  },
  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
  },

}
