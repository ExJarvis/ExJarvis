const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const rootPath = path.resolve(__dirname, '..')

console.log(process.env.web);

module.exports = env => ({
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['main', 'module', 'browser']
  },
  entry: path.resolve(rootPath, 'src', 'github.io.tsx'),
  target: 'web',
  // target: 'electron-renderer',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(?:le|c)ss$/,
        use: [{
          loader: "style-loader"
      }, {
          loader: "css-loader"
      }, {
          loader: "less-loader",
          options: {
            lessOptions: {
               javascriptEnabled: true
            }
          }
      }],
      },
      // {
      //   exclude: [/\.(js|jsx|mjs|ejs)$/, /\.html$/, /\.json$/],
      //   loader: require.resolve('file-loader'),
      //   options: {
      //     name: 'images/[name].[hash:8].[ext]',
      //   },
      // },
      // {
      //   test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.svg$/, /\.png$/],
      //   loader: require.resolve('url-loader'),
      //   options: {
      //     limit: 10000,
      //     name: 'images/[name].[hash:8].[ext]',
      //   },
      // },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ]
  },
  devServer: {
    contentBase: path.join(rootPath, 'dist/github.io'),
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 4001,
    publicPath: '/'
  },
  output: {
    path: path.resolve(rootPath, 'dist/github.io'),
    filename: 'js/[name].js',
    publicPath: './'
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ]
});
