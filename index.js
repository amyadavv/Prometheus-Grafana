const express = require("express");
const client = require("prom-client")
const { doSomeHeavyTask } = require("./util");
const responseTime = require("response-time");
const { createLogger, transports, log } = require("winston");
const LokiTransport = require("winston-loki");


const options = {
    transports: [
        new LokiTransport({
            labels: {
                appName: 'express'
            },
            host: "http://127.0.0.1:3100"
        })
    ]
};
const logger = createLogger(options);

const app = express();
const PORT = process.env.PORT || 8000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const reqResTime = new client.Histogram({
    name: "http_express_req_res_time",
    help: "This tells how much time is taken by req and res",
    labelNames: ["method", "route", "status_code"],
    buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000]
})

const totalRequestCounter = new client.Counter({
    name: "total_req",
    help: "tells total req"
})

app.use(responseTime((req, res, time) => {
    totalRequestCounter.inc();
    reqResTime.labels({
        method: req.method,
        route: req.url,
        status_code: res.statusCode,
    }).observe(time);
}))

app.get("/", (req, res) => {
    logger.info("Request came on / route")
    return res.json({ message: "Hello from express server" });
})

app.get("/slow", async (req, res) => {
    try {
        logger.info("Request came on / slow route")
        const timeTaken = await doSomeHeavyTask();
        return res.json({
            status: "Success",
            message: `Heavy task completed in ${timeTaken}`,
        })
    } catch (error) {
        logger.error(error.message)
        return res.status(500).json({ status: "Error", error: "Internal server error " })
    }
});

app.get("/metrics", async (req, res) => {
    res.setHeader('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.end(metrics);
})

app.listen(PORT, () => {
    console.log(`Express server on ${PORT}`)
})