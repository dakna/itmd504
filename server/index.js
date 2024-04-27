import express from "express";

const port = 3000;
const startupDate = new Date();

const app = express();

app.get("/api/healthcheck", (_req, res) => {
  res.json({ message: `API is running since ${startupDate.toISOString()}` });
});

app.listen(port, () => {
  console.log("API server listening on port", port);
});