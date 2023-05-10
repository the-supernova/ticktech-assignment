import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import cluster from "cluster";
import { cpus } from "os";
import express, { json } from "express";
import axios from "axios";

const workers = [];
let nextWorker = 1;
const lbApp = express();

function getNextWorker() {
  const worker = workers[nextWorker];
  nextWorker = (nextWorker + 1) % workers.length;
  return worker;
}

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < cpus().length; i++) {
    const worker = cluster.fork();
    workers.push(worker);
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    const idx = workers.indexOf(worker);
    if (idx !== -1) {
      workers.splice(idx, 1);
    }
    console.log(`Starting a new worker`);
    const newWorker = cluster.fork();
    workers.push(newWorker);
  });

  lbApp.use(json());
  lbApp.all("*", (req, res) => {
    const worker = getNextWorker();
    console.log(
      `Redirecting ${req.url} to worker ${workers.indexOf(worker)}/${
        worker.process.pid
      }`
    );
    cluster.once("message", (worker, response) => {
      console.log(
        `Primary ${process.pid} received response from worker ${worker.process.pid}`
      );
      res.status(response.statusCode).send(response.data);
    });

    worker.send({
      url: req.url,
      method: req.method,
      body: req.body,
    });
  });

  lbApp.listen(4000, () => {
    console.log(`Load balancer is listening on port 4000`);
  });
} else {
  const PORT = parseInt(process.env.PORT) || 4000;

  app.listen(PORT + cluster.worker.id, () => {
    console.log(
      `Worker ${cluster.worker.id} started and listening on port ${
        PORT + cluster.worker.id
      }`
    );
  });

  process.on("message", async (req) => {
    const { url, method, body } = req;

    try {
      const apiResponse = await axios({
        method,
        url: `http://localhost:${PORT + cluster.worker.id}${url}`,
        data: body,
      });

      const response = {
        statusCode: apiResponse.status,
        data: apiResponse.data,
      };

      process.send(response);
    } catch (error) {
      const response = {
        statusCode: error.response.status,
        data: error.response.data,
      };

      process.send(response);
    }
  });
}
