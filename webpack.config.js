const webpack = require('webpack');
const slsw = require('serverless-webpack');
var dotenv = require('dotenv').config({ path: __dirname + '/.env' });

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode:'development',
  
  plugins: [
    new webpack.DefinePlugin({
      'process.env.SHOPIFY_API_KEY': JSON.stringify(dotenv.parsed.SHOPIFY_API_KEY),
      'process.env.SHOPIFY_API_SECRET_KEY': JSON.stringify(dotenv.parsed.SHOPIFY_API_SECRET_KEY),
      'process.env.SUBDOMAIN': JSON.stringify(dotenv.parsed.SUBDOMAIN),
      'process.env.FRONTEND': JSON.stringify(dotenv.parsed.FRONTEND)
    })
  ],


};


