const router = require('express').Router();

const multer = require('multer');

const path = require('path');

const File = require('../models/file');

const {v4:uuid4 } = require('uuid');

let storage = multer.diskStorage({
    destination: (req,file, cb) => cb(null, 'uploads/'),

    filename: (req, file, cb) =>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

let upload = multer({
    storage ,
    limit : { fileSize: 1000000*100},

}).single('myFile')

router.post('/',(req,res)=>{

    
    // store file

    upload(req, res, async (err)=>{

        // validate request
        if(!req.file){
            return res.json({error: 'Files not found'});
        }


        if(err){
            return res.status(500).send({ error:err.message });
        }

        // store into database

        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        });


        const response = await file.save();

        return res.render('uploaded', {file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});

    });

    
});



router.post('/send', async (req, res)=>{
    const { uuid, emailTo, emailFrom } = req.body;

    console.log(uuid, emailTo, emailFrom);
    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({ error: 'All fields are required'});
    }

    // Get data from database

    const file = await File.findOne({ uuid: uuid});

    

    file.sender = emailFrom;

    file.reciever = emailTo;

    const response = await file.save();

    // send email

    const sendMail = require('../services/emailService');

    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'QuickShare File Sharing',
        text: `${emailFrom} shared a file with you.`,
        hmtl: `<h1> ${process.env.APP_BASE_URL}/files/${file.uuid}<h1>`
    })

});

module.exports = router;