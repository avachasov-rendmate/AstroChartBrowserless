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
  optimization: {
    minimize: true
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
    path: '/home/vachick/PhpstormProjects/MixPlacesAPI/api/lib/astro-chart',//path.resolve(__dirname, 'dist'),
    filename: 'astro-chart-browserless.js',
    library: {
      name: 'astro',
      type: 'commonjs2',
    }
  },
}