const path = require('path')

module.exports = {
  entry: './project/src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /.test.ts/],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  mode: 'production',
  experiments: {
    outputModule: true
  },
  output: {
    // clean: true,
    path: path.resolve(__dirname, 'dist'),
    filename: 'astro-chart-browserless.js',
    library: {
      // name: 'astro-chart-browserless',
      type: 'module',
    }
  },
}