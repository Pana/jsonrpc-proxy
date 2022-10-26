const Router = require('koa-router');
const router = new Router();
const axios = require('axios').default;
const URL = require('./config.json').url;
const debug = require('debug')('rpc-proxy');
const JsonRpcProxy  = require('web3-providers-http-proxy');

const proxy = new JsonRpcProxy(URL, {respAddressBeHex: true});

router.post('/proxyWithLog', async ctx => {
  const {
    id,
    jsonrpc,
    method,
    params,
  } = ctx.request.body;

  debug(method, params);

  const { data } = await axios.post(URL, {
    id,
    jsonrpc,
    method,
    params,
  });
  ctx.body = data;
});

router.post('/', async ctx => {
    const {
        id,
        jsonrpc,
        method,
        params,
    } = ctx.request.body;

    debug(method, params);

    let result = await proxy.asyncSend(ctx.request.body);
    ctx.body = result;
});

module.exports = router;