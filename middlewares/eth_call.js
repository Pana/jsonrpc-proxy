
module.exports = async function(ctx, next) {

    if (ctx.request.rpcMethod === 'eth_call' || ctx.request.rpcMethod === 'eth_estimateGas') {
        if (ctx.request.body.params[0]) {
            if (ctx.request.body.params[0].gasPrice && (ctx.request.body.params[0].maxFeePerGas && ctx.request.body.params[0].maxPriorityFeePerGas)) {
                delete ctx.request.body.params[0].gasPrice;
            }
        }
    }

    await next();
}