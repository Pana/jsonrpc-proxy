

module.exports = function (logger) {
    return async function(ctx, next) {
        try {
            const {id, method, params} = ctx.request.body;
            ctx.request.rpcId = id;
            ctx.request.rpcMethod = method;

            logger.info(`Request: Req-${id} ${method}, ${JSON.stringify(params, null, '\t')}`);

            await next();

            logger.info(`Response: ${JSON.stringify(ctx.body, null, '\t')}`);

            if (ctx.body.error) {
                logger.error(`Req-${id} Error: ${JSON.stringify({
                    method,
                    params,
                    error: ctx.body.error
                })}`);
            }
        } catch (error) {
            logger.error(`Error: ${error.message || error}`);
            throw error;
        }
    }
}