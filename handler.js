const jwt = require('jsonwebtoken');
const axios = require('axios');
const cookie = require('cookie');

module.exports.hello = async (event, context, callback) => {

  const authRoute = '/auth';
  const cookieString = event.headers.cookie;
  var shop = event.queryStringParameters.shop;
  
  var cookies = null;
  var jwtToken = null;
  var shopifyAccess = null;

  var redirectAuth = {
    statusCode: 301,
    headers: {
      Location: `${authRoute}?shop=${shop}`,
    },
  };
  
  var redirectApp = {
    statusCode: 301,
    headers: {
      Location: process.env.FRONTEND,
    },
  };

  if (cookieString != undefined) {
    cookies = cookie.parse(cookieString);
    jwtToken = cookies.jwtToken;

    if (jwtToken != undefined && jwtToken.apiKey === process.env.SHOPIFY_API_KEY) {
      var decoded = jwt.verify(jwtToken, process.env.SHOPIFY_API_SECRET_KEY);
      shopifyAccess = decoded;
    }

  } else {
    return callback(null, redirectAuth);
  }

  if (shopifyAccess === null) {
    return callback(null, redirectAuth);
  }

  if (shopifyAccess && shop && shopifyAccess.shop !== shop) {
    return callback(null, redirectAuth);
  }

  if (shopifyAccess && shopifyAccess.accessToken) {
    try {
      console.log(
        `https://${shopifyAccess.shop}/admin/metafields.json`,
        shopifyAccess.accessToken
      );
      var response = await axios({
        method: 'GET',
        url: `https://${shopifyAccess.shop}/admin/metafields.json`,
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifyAccess.accessToken,
        },
      });
    } catch (error) {
      console.log('error');
      return callback(null, redirectAuth);
    }
  } else {
    return callback(null, redirectAuth);
  }

  return callback(null, redirectApp);

};
