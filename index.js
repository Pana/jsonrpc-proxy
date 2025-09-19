const Koa = require('koa');
const axios = require('axios');
const winston = require('winston');
require('winston-daily-rotate-file');
const { bodyParser } = require("@koa/bodyparser");
require('dotenv').config();
const jsonrpcMeta = require('./middlewares/jsonrpc_meta');

const app = new Koa();
const PORT = process.env.PORT || 3000;
const TARGET_URL = process.env.JSONRPC_URL;

var log_transport = new winston.transports.DailyRotateFile({
    level: 'info',
    filename: './logs/proxy-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '100m',
    maxFiles: '3d'
});

var error_transport = new winston.transports.DailyRotateFile({
    level: 'info',
    filename: './logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '100m',
    maxFiles: '7d'
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
    ),
    transports: [
        new winston.transports.Console(),
        log_transport,
        error_transport,
    ]
});

// 解析 JSON 请求体
app.use(bodyParser());

app.use(jsonrpcMeta(logger));

// 不支持 batch 请求
app.use(async (ctx) => {
    // 将请求转发到目标 JSON-RPC 服务器
    const {data} = await axios.post(TARGET_URL, ctx.request.body);
    ctx.body = data;
});

app.listen(PORT, () => {
    console.log(`JSON-RPC proxy server is running on port ${PORT}`);
});