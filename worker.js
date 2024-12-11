/**
 * This script is responsible for running background jobs for the application.
 * The jobs are defined in the 'fileQueue' and 'userQueue' collections.
 * The jobs are processed using the 'bull' library.
 * The jobs are processed one at a time, and the script will exit when all jobs are complete.
 */
import DBClient from './utils/db';

/**
 * Process jobs in the 'fileQueue' collection.
 * Each job should have a 'fileId' and 'userId' property.
 * The script will create thumbnails of the file at the specified widths.
 * The thumbnails will be saved with the same name as the file, but with the width appended to the end.
 * The thumbnails will be saved in the same directory as the file.
 */
const fileQueue = new Bull('fileQueue');

/**
 * Process jobs in the 'userQueue' collection.
 * Each job should have a 'userId' property.
 * The script will send a welcome email to the user.
 */
const userQueue = new Bull('userQueue');

/**
 * Create a thumbnail of an image at the specified path and width.
 * The thumbnail will be saved with the same name as the file, but with the width appended to the end.
 * The thumbnail will be saved in the same directory as the file.
 * @param {string} path - The path to the image file.
 * @param {Object} options - An options object with a 'width' property.
 */
const createImageThumbnail = async (path, options) => {
  try {
    const thumbnail = await imageThumbnail(path, options);
    const pathNail = `${path}_${options.width}`;

    await fs.writeFileSync(pathNail, thumbnail);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Process a job in the 'fileQueue' collection.
 * @param {Object} job - The job object from the 'fileQueue' collection.
 */
fileQueue.process(async (job) => {
  const { fileId } = job.data;
  if (!fileId) throw Error('Missing fileId');

  const { userId } = job.data;
  if (!userId) throw Error('Missing userId');

  const fileDocument = await DBClient.db.collection('files').findOne({ _id: ObjectId(fileId), userId: ObjectId(userId) });
  if (!fileDocument) throw Error('File not found');

  createImageThumbnail(fileDocument.localPath, { width: 500 });
  createImageThumbnail(fileDocument.localPath, { width: 250 });
  createImageThumbnail(fileDocument.localPath, { width: 100 });
});

/**
 * Process a job in the 'userQueue' collection.
 * @param {Object} job - The job object from the 'userQueue' collection.
 */
userQueue.process(async (job) => {
  const { userId } = job.data;
  if (!userId) throw Error('Missing userId');

  const userDocument = await DBClient.db.collection('users').findOne({ _id: ObjectId(userId) });
  if (!userDocument) throw Error('User not found');

  console.log(`Welcome ${userDocument.email}`);
});
