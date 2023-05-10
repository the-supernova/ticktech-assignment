import { Router } from 'express';
const usersRouter = Router();
import { client } from '../app.js';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

usersRouter.get('/', async (req, res) => {
    const users = await client.hGetAll('users');
    const usersArr = [];
    for (const user in users) {
        usersArr.push(JSON.parse(users[user]));
    }
    res.status(200).json(usersArr);
})

usersRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!uuidValidate(id)) {
        return res.status(400).json({ error: 'invalid id' });
    }
    const user = await client.hGet('users', id);
    if (user) {
        res.status(200).json(JSON.parse(user));
    } else {
        return res.status(404).json({ error: 'user not found' });
    }
})

usersRouter.post('/', async (req, res) => {
    const { username, age, hobbies } = req.body;
    if (!username || !age || !hobbies) {
        return res.status(400).json({ error: 'missing required fields' });
    }
    const id = uuidv4();
    const user = { id, username, age, hobbies };
    await client.hSet('users', id, JSON.stringify(user));
    res.status(201).json(user);
})

usersRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    if (!uuidValidate(id)) {
        return res.status(400).json({ error: 'invalid id' });
    }
    const isExistingUser = await client.hExists('users', id);
    if (!isExistingUser) {
        return res.status(404).json({ error: 'user not found' });
    }
    const { username, age, hobbies } = req.body;
    await client.hSet('users', id, JSON.stringify({ id, username, age, hobbies }));
    res.status(200).json({ id, username, age, hobbies });
})

usersRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!uuidValidate(id)) {
        return res.status(400).json({ error: 'invalid id' });
    }
    const isExistingUser = await client.hExists('users', id);
    if (!isExistingUser) {
        return res.status(404).json({ error: 'user not found' });
    }
    await client.hDel('users', id);
    res.status(204).end();
})

usersRouter.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'internal server error' });
})

export default usersRouter;
