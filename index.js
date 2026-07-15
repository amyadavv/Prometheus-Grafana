const express = require("express");
const client = require("prom-client")
const { doSomeHeavyTask } = require("./util");

const app = express();
const PORT = process.env.PORT || 8000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

app.get("/", (req, res) => {
    return res.json({ message: "Hello from express server" });
})

app.get("/slow", async (req, res) => {
    try {
        const timeTaken = await doSomeHeavyTask();
        return res.json({
            status: "Success",
            message: `Heavy task completed in ${timeTaken}`,
        })
    } catch (error) {
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