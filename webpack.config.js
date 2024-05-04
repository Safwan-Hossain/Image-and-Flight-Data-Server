import path, { dirname } from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
// console.log(path.join(process.cwd(), 'dist'))
console.log(path.resolve(__dirname, 'node_modules/vtk.js/Sources'))

export default {
  mode: 'development',
  entry: './src/frontend/scripts/client/client.js', 
  output: {
    path: path.join(process.cwd(), 'dist'), 
    filename: 'bundle.js', 
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
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