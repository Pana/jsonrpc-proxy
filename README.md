# jsonrpc-proxy

This is a jsonrpc proxy and also a conflux to evm bridge. Which is using [web3-providers-http-proxy](https://github.com/conflux-fans/web3-providers-http-proxy) to convert conflux rpc to evm rpc.

## Usage

```bash
$ npm install
$ cp config.json.sample config.json  # then set conflux rpc url in the config
$ node index.js # start the proxy
```