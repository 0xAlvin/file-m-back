#!/usr/bin/node
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import AuthController from './AuthController';


class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;
        if (redisClient.isAlive() && dbClient.isAlive()) {
            if (!email) {
                res.status(400).send({ "error": "Missing email" });
            } else if (!password) {
                res.status(400).send({ "error": "Missing email" });
            } else {
                const DB = dbClient.client.db();
                if (await DB.collection('users').findOne({ email })) {
                    res.status(400).json({ "error": "Already exist" });
                } else {
                    const user = AuthController.hashPassword(email, password);
                    const result = await DB.collection('users').insertOne(user);
                    const { ops } = result;
                    res.status(201).json(
                        {
                            'id': ops[0]._id,
                            'email': ops[0].email
                        }
                    );
                }
            }
        }
    }
    static async getMe(req, res) {
        const { ObjectID } = require('mongodb');
        const token = req.headers['x-token'];
        const key = 'auth_'.concat(token);
        const DB = dbClient.client.db();
        try {
            const user_id = await redisClient.get(key);
            if (user_id) {
                const user = await DB.collection('users').findOne({ _id: new ObjectID(user_id) });
                res.status(200).json({ 'id': user._id, 'email': user.email });
            } else {
                res.status(401).json({ error: 'Unauthorized' });
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
export default UsersController;
module.exports = UsersController;
