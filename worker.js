const Bull = require('bull');
const dbClient = require('./utils/db.js');
const { generateThumbnail } = require('image-thumbnail');
const fs = require('fs').promises;
const ObjectID = require('mongodb').ObjectId;

const fileQueue = new Bull('fileQueue');
const sizes = [500, 250, 100];

fileQueue.process(async (job) => {
  const DB = dbClient.client.db();

  const { fileId, userId } = job.data;
  if (!fileId) {
    throw new Error('Missing fileId');
  }
  if (!userId) {
    throw new Error('Missing userId');
  }

  const file = await DB.collection('files')
    .findOne({ fileId: new ObjectID(fileId), userId: new ObjectID(userId) });

  if (file) {
    await generateThumbnails(file.localPath);
  } else {
    throw new Error('File not found');
  }
});

async function generateThumbnails(filePath) {
  await Promise.all(
    sizes.map(async (size) => {
      const thumbnail = await generateThumbnail(filePath, { width: size });
      const thumbnailPath = filePath.replace(/(\.[\w\d_-]+)$/i, `_${size}$1`);
      await fs.writeFile(thumbnailPath, thumbnail);
    })
  );
}