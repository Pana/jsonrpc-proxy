const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const routes = require('./router');
const PORT = require('./config.json').port;

const app = new Koa();

// const cors = require('@koa/cors');
// app.use(cors());

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(bodyParser({
  enableTypes: ['json', 'text'],
  jsonLimit: '2mb',
}));

app
  .use(routes.routes())
  .use(routes.allowedMethods());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));