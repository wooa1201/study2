module.exports = {
  entry: './source/App.js',

  output: {
    path: `${__dirname}`,
    filename: 'bundle.js',
  },

  devServer: {
    inline: true,
    port: 7777,
    contentBase: `${__dirname}`,
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
};
