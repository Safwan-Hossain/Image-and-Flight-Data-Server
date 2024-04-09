import path, { dirname } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
// console.log(path.join(process.cwd(), 'dist'))

export default {
  mode: 'development',
  entry: './frontend/scripts/client.js', 
  output: {
    path: path.join(process.cwd(), 'dist'), 
    filename: 'bundle.js', 
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    // alias: {
    //   '@kitware/vtk.js': path.resolve(__dirname, 'node_modules/@kitware/vtk.js'),
    // },
  },
  
  module: {
    rules: [
      {
        test: /\.js$/, 
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'] 
          }
        }
      }
    ]
  }
};