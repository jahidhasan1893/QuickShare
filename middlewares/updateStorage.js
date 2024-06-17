const fs = require('fs-extra');
const path = require('path');
const cron = require('node-cron');
const File = require('../models/file')

const folderPath = path.join(__dirname, '/../uploads');


const updateStorage = (req, res, next) => {

  // schedule cron job
  cron.schedule('0 0 * * *', async () => {
    console.log('Files updated at', new Date().toLocaleString());
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
            await File.deleteOne({
                fileName: file
            })
            console.log('Deleted file:', filePath);
          } catch (err) {
            console.error('Error deleting file:', err);
          }
        }
      }
    } catch (err) {
      console.error('Error reading directory or processing files:', err);
    }
  },{
    scheduled: true,
    timezone: 'Asia/Dhaka'
  });

  next();
};

module.exports = updateStorage;
