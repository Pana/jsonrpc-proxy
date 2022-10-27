const Router = require('koa-router');
const router = new Router();
const axios = require('axios').default;
const URL = require('./config.json').url;
const debug = require('debug')('rpc-proxy');
const JsonRpcProxy  = require('web3-providers-http-proxy');

const proxy = new JsonRpcProxy(URL, {respAddressBeHex: true, respTxBeEip155: true});

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
    const reqs = Array.isArray(ctx.request.body) ? ctx.request.body : [ctx.request.body];
    for(let req of reqs) {
        const {
            method,
            params,
        } = req;
        debug(method, params);
    }

    const result = await proxy.asyncSend(ctx.request.body);
    ctx.body = result;
});

module.exports = router;