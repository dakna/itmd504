import dotenv from "dotenv";
dotenv.config({
    path: ".env.server"
})

import express from "express";

const port = process.env.PORT || 5000;
const startupDate = new Date();

const app = express();

app.get("/api/healthcheck", (_req, res) => {
  res.json({ message: `API is running since ${startupDate.toISOString()}` });
});

app.listen(port, () => {
  console.log("API server listening on port", port);
});