const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.JWT_SECRET.trim()) {
    console.error("JWT_SECRET is missing from server/.env. Add a long random secret before starting the API.");
    process.exit(1);
}

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors({ exposedHeaders: ["X-Request-ID"] }));
app.use((req, res, next) => {
    const requestId = crypto.randomUUID();
    const startedAt = Date.now();
    req.requestId = requestId;
    res.setHeader("X-Request-ID", requestId);
    res.on("finish", () => {
        const line = `[api][${res.statusCode}][${requestId}] ${req.method} ${req.path} ${Date.now() - startedAt}ms`;
        if (res.statusCode >= 400) console.error(line);
        else console.info(line);
    });
    next();
});
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/challenges", require("./routes/challengeRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/pilots", require("./routes/pilotRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/startups", require("./routes/startupRoutes"));

app.get("/", (req, res) => {
    res.json({
        message: "InnoProcure Backend is running"
    });
});

app.use("/api", (req, res) => {
    return res.status(404).json({
        message: "API endpoint not found",
        requestId: req.requestId
    });
});

app.use((error, req, res, next) => {
    console.error(`[api][uncaught][${req.requestId || "no-request-id"}] ${req.method} ${req.path}`, error?.stack || error);
    if (res.headersSent) return next(error);
    return res.status(error.status || 500).json({
        message: error.status && error.status < 500 ? "Invalid request" : "Server error",
        requestId: req.requestId
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
