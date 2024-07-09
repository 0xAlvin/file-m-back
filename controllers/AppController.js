#!/usr/bin/node
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
class AppController {
    static getStatus(_, response) {
        if (redisClient.isAlive() && dbClient.isAlive()) {
            return response.status(200).json({ "redis": true, "db": true });
        }
        return response.status(200).json({ "redis": redisClient.isAlive(), "db": dbClient.isAlive() });
    }
    static getStats(_, response) {
        const users =  0;
        const files =  0;
        return response.status(200).json(
            {
                "users": users,
                "files": files
            });
    }
}
export default AppController;
module.exports = AppController;
