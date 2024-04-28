import dotenv from "dotenv";
dotenv.config({
    path: ".env.server"
})

import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;

const databaseId = process.env.COSMOS_DB_ID;
const containerId = process.env.COSMOS_DB_CONTAINER;
const partitionKey = { kind: 'Hash', paths: ['/partitionKey'] }

const options = {
      endpoint: endpoint,
      key: key,
      userAgentSuffix: 'itmd504'
    };


const client = new CosmosClient(options)
const container = client.database(databaseId).container(containerId);

import express from "express";

const port = process.env.PORT || 5000;
const startupDate = new Date();

const app = express();

app.listen(port, () => {
  console.log("API server listening on port", port);
});

app.get("/api/healthcheck", (_req, res) => {
  res.json({ message: `API is running since ${startupDate.toISOString()} using databaseId ${databaseId}, containerId ${containerId}` });
});

app.get("/api/applications", async (_req, res) => {
  console.log(`requested ${_req.path}`);
  
  const querySpec = {
    query: 'SELECT r FROM root r',
    parameters: []
  }

  const { resources: results } = await container.items
    .query(querySpec)
    .fetchAll();
     
  console.log(`${_req.path} returned \n${JSON.stringify(results)}\n`)
  res.status(200).json(results);
  
});