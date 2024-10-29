/**
 * Base webpack config used across other specific configs
 */

import webpack from 'webpack';
import webpackPaths from './webpack.paths';
import { dependencies as externals } from '../../release/app/package.json';

const path = require('path');

const configuration: webpack.Configuration = {
  externals: [...Object.keys(externals || {})],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
            compilerOptions: {
              module: 'esnext',
            },
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
    alias: {
      '@shared': path.resolve(__dirname, '..', '..', 'src/shared/'),
      '@assets': path.resolve(__dirname, '..', '..', 'src/renderer/assets/'),
      '@context': path.resolve(__dirname, '..', '..', 'src/renderer/context/'),
      '@hooks': path.resolve(__dirname, '..', '..', 'src/renderer/hooks/'),
      '@plugins': path.resolve(__dirname, '..', '..', 'src/plugins/'),
      '@main': path.resolve(__dirname, '..', '..', 'src/main/'),
      '@selectors': path.resolve(
        __dirname,
        '..',
        '..',
        'src/renderer/selectors/',
      ),
      '@features': path.resolve(
        __dirname,
        '..',
        '..',
        'src/renderer/features/',
      ),
    },
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};

export default configuration;
