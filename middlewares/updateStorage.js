const fs = require('fs-extra');
const path = require('path');
const cron = require('node-cron');

const folderPath = path.join(__dirname, '/../uploads');


const updateStorage = (req, res, next) => {
    console.log("hello")

  // schedule cron job
  cron.schedule('0 0 0 * *', async () => {
    console.log('Cron job started at', new Date().toLocaleString());
    try {
      const files = await fs.readdir(folderPath);

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = await fs.stat(filePath);

        const ageInDays = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        console.log(ageInDays);
        if (ageInDays > 1) {
          try {
            await fs.remove(filePath);
            console.log('Deleted file:', filePath);
          } catch (err) {
            console.error('Error deleting file:', err);
          }
        }
      }
    } catch (err) {
      console.error('Error reading directory or processing files:', err);
    }
  });

  next();
};

module.exports = updateStorage;
