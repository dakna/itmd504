import dotenv from "dotenv";
dotenv.config({
    path: ".env.server"
})

import { Guid } from 'js-guid';
import cors from "cors";
import { seedApplications } from "./seed.js";

import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;

const databaseId = process.env.COSMOS_DB_ID;
const containerId = process.env.COSMOS_DB_CONTAINER;
const partitionKey = { kind: 'Hash', paths: ['/partitionKey'] }
const defaultPartitionKey = 'EAST';

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
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log("API server listening on port", port);
});

app.get("/api/healthcheck", (req, res) => {  
  console.log(`requested ${req.method} ${req.path}`);

  res.json({ message: `API is running since ${startupDate.toISOString()} using databaseId ${databaseId}, containerId ${containerId}` });

});

app.get("/api/applications", async (req, res) => {
  console.log(`requested ${req.method} ${req.path}`);
  
  try {
    const querySpec = {
      query: 'SELECT a.id, a.collegeId, a.partitionKey, a.firstName, a.lastName, a.address, a.references, a.motivation, a.resumeUrl  FROM a',
      parameters: []
    }

    const { resources: results } = await container.items
      .query(querySpec)
      .fetchAll();
      
    console.log(`${req.path} returned applications \n${JSON.stringify(results)}\n`)
    res.status(200).json(results);

  } catch (err) {

    console.error(err);
    res.status(500).send(err.message);

  }
  
});

app.get("/api/applications/:id/:partitionKey", async (req, res) => {
  console.log(`requested ${req.method} ${req.path}`);

  try {
    const id = req.params.id;
    const partitionKey = req.params.partitionKey;

    const querySpec = {
      query: 'SELECT a.id, a.collegeId, a.partitionKey, a.firstName, a.lastName, a.address, a.references, a.motivation, a.resumeUrl  FROM a where a.id = @id and a.partitionKey = @partitionKey',
      parameters: [
        {
          "name": "@id",
          "value": id
        },         {
          "name": "@partitionKey",
          "value": partitionKey
        }          
      ]
    }

    // console.log(`querySpec ${JSON.stringify(querySpec)}`)

    const { resources: results } = await container.items
      .query(querySpec)
      .fetchAll();

    if (results.length == 1) {

      console.log(`${req.path} returned application with id ${results[0].id}`);
      res.status(200).json(results[0]);
    
    } else if (results.length > 1) {
      throw Error(`Found more than one application with id ${id} and partitionKey ${partitionKey}`)
    } else { 
      throw Error(`Unable to find application with id ${id} and partitionKey ${partitionKey}`)
    }

  } catch (err) {

    console.error(err);
    res.status(500).send(err.message);

  }
  
});

app.post("/api/applications", async (req, res) => {
  console.log(`requested ${req.method} ${req.path}`);

  try {
    const newApplication = req.body;
    newApplication.id = Guid.newGuid().toString();
    newApplication.partitionKey = defaultPartitionKey;

    console.log(`newApplication ${JSON.stringify(newApplication)}`);

    const { item } = await container.items.create(newApplication);

    console.log(`${req.path} created application with id ${item.id}`);
    res.status(200).json(newApplication);

  } catch (err) {

    console.error(err);
    res.status(500).send(err.message);

  }
  
});

app.put("/api/applications/:id/:partitionKey", async (req, res) => {
  console.log(`requested ${req.method} ${req.path}`);

  try {
    const id = req.params.id;
    const partitionKey = req.params.partitionKey;
    const updatedApplication = req.body;

    //console.log(`updatedApplication ${JSON.stringify(updatedApplication)}`);

    const { item } = await container.item(id, partitionKey).replace(updatedApplication);

    console.log(`${req.path} updated application with id ${item.id}`);
    res.status(200).send();

  } catch (err) {

    console.error(err);
    res.status(500).send(err.message);

  }
  
});

app.delete("/api/applications/:id/:partitionKey", async (req, res) => {
  console.log(`requested ${req.method} ${req.path}`);
  
  try {
    const id = req.params.id;
    const partitionKey = req.params.partitionKey;

    const { item } = await container.item(id, partitionKey).delete();

    console.log(`${req.path} deleted application with id ${item.id}`);
    res.status(200).send();

  } catch (err) {

    console.error(err);
    res.status(500).send(err.message);

  }
  
});

app.post("/api/seed-applications", async (req, res) => {
  console.log(`requested ${req.method} ${req.path}`);

  try {

    await client.databases.createIfNotExists({id: databaseId})
    await client.database(databaseId).containers.createIfNotExists({ id: containerId, partitionKey })
    
    console.log(`Created database: ${databaseId}\nCreated container: ${containerId} `);

    const container = client.database(databaseId).container(containerId);

    let response = await container.items.upsert(seedApplications.SEED1);
    console.log(`${req.path} inserted application with id ${response.item.id}`);
    
    response = await container.items.upsert(seedApplications.SEED2);
    console.log(`${req.path} inserted application with id ${response.item.id}`);

    res.status(200).send();

  } catch (err) {

    console.error(err);
    res.status(500).send(err.message);

  }
  
});