import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';

class AuthController {
  static async getConnect(req, res) {
    try {
      const header = req.headers.authorization;
      const credentials = Buffer.from(header.split('Basic ')[1], 'base64').toString('utf-8');
      const [email, password] = credentials.split(':');
      const user = this.hashPassword(email, password);
      const DB = dbClient.client.db();

      // Check if the user exists in the database
      const userInDB = await DB.collection('users').findOne({ email });

      if (!userInDB) {
        res.status(401).json({ error: 'Unauthorized' });
      } else if (user.password === userInDB.password) {
        const uuid = require('uuid');
        const token = uuid.v4().toString();
        const key = 'auth_'.concat(token);

        await redisClient.set(key, userInDB._id.toString(), 86400);
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: 'Unauthorized' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    const key = 'auth_'.concat(token);

    try{
        const user_id = await redisClient.get(key);
        if (user_id){
          await redisClient.del(key);
          res.status(204);
        }else{
          res.status(401).json({error : 'Unauthorized'});
        }

    }catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
    }
  }

  static hashPassword(email, password) {
    const crypto = require('crypto');
    const hashed_password = crypto.createHash('sha1').update(password).digest('hex');
    const user = {
      email,
      password: hashed_password,
    };
    return user;
  }
}

export default AuthController;
module.exports = AuthController;
