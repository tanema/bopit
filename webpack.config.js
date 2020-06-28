const path = require('path')

module.exports = {
  entry: {
    bop: './src/index.js',
    example: './example/index.js'
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/, /\.test\.js$/],
        use: { loader: 'babel-loader' }
      }
    ]
  },
  externals: {}
}
