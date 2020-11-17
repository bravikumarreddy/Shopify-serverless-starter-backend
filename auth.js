
const jwt = require('jsonwebtoken');
const serverless = require('serverless-http');
const shopifyAuth = require ('@shopify/koa-shopify-auth').default;

const Koa = require('koa');
const app = new Koa();

app.use(
  shopifyAuth({
    apiKey: process.env.SHOPIFY_API_KEY,
    secret: process.env.SHOPIFY_API_SECRET_KEY,
    scopes: [
      'read_themes, write_themes',
      'read_script_tags',
      'write_script_tags',
    ],
    accessMode: 'offline',

    async afterAuth(ctx) {
      console.log('We did it!', ctx.state);

      const { shop, accessToken } = ctx.state.shopify;
      
      ctx.cookies.set('shop', shop, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        domain: process.env.SUBDOMAIN,
      });
      
      ctx.cookies.set('accessToken', accessToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        domain: process.env.SUBDOMAIN,
      });
      
      var token = jwt.sign(
        {
          shop: shop,
          accessToken:accessToken,
          apiKey: process.env.SHOPIFY_API_KEY
        },
        process.env.SHOPIFY_API_SECRET_KEY
      );

      ctx.cookies.set('jwtToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: process.env.SUBDOMAIN,
      });

      
      ctx.statusCode = '302';
      ctx.redirect(process.env.FRONTEND);
    },
  })
);

app.use(async (ctx) => {

  const {
    query: { shop },
  } = ctx;
  const routeForRedirect = shop == null ? `/` : `/auth/?shop=${shop}`;
  ctx.redirect(routeForRedirect);

});


module.exports.handler = serverless(app);

