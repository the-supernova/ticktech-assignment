import express, { json } from 'express';
const app = express()
import usersRouter from './controllers/users.js';
import { createClient } from 'redis';
import cluster from 'cluster';

export const client = createClient();
//client.select(cluster.worker.id)
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();

app.use(json())
app.use('/api/users', usersRouter)
app.all('*', async (req, res) => {
    res.status(404).json({ error: 'resource not found' });
})
//app.use(errorHandler)

export default app;
