const Router = require('koa-router');
const router = new Router();
const axios = require('axios').default;
const URL = require('./config.json').url;
const debug = require('debug')('rpc-proxy');
const JsonRpcProxy  = require('web3-providers-http-proxy');
const fs = require('fs');
const path = require('path');

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
    const body = ctx.request.body;
    if (!Array.isArray(body) && Object.keys(body).length === 0) {
        ctx.body = {
            error: {code: -32600, message: 'Invalid Request'},
            id: 1,
            jsonrpc: '2.0',
        };
        return;
    }
    const reqs = Array.isArray(body) ? body : [body];
    for(let req of reqs) {
        const {
            method,
            params,
        } = req;
        debug(method, params);
        fs.appendFile(path.join(__dirname, './log.txt'), JSON.stringify({method, params}, null, '\t'), () => {});
    }

    const result = await proxy.asyncSend(ctx.request.body);
    if (result.error) {
        fs.appendFile(path.join(__dirname, './log.txt'), JSON.stringify(result.error, null, '\t'), () => {});
    }
    ctx.body = result;
});

module.exports = router;