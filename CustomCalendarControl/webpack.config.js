const path = require('path'); // Correctly require the 'path' module

module.exports = {
  entry: './CustomCalendarControl/index.ts', // Ensure this path points to the correct location of index.ts
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
