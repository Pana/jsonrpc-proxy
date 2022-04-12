const Router = require('koa-router');
const router = new Router();
const axios = require('axios').default;
const URL = require('./config.json').url;
// const URL = 'https://evm.confluxrpc.com';

const toHack = [
  'eth_getBalance',
  'eth_getCode',
  'eth_call'
];

router.post('/', async ctx => {
  const {
    id,
    jsonrpc,
    method,
    params,
  } = ctx.request.body;

  if (method === 'eth_getStorageAt' && params[2] === 'pending') {
    params[2] = 'latest';
  }
  if (toHack.includes(method) && params[1] === 'pending') {
    params[1] = 'latest';
  }
  // console.log(method, params);
  const { data } = await axios.post(URL, {
    id,
    jsonrpc,
    method,
    params,
  });
  ctx.body = data;
});

module.exports = router;