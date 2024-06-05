const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();

const multer = require('multer');
// const path = require('path');
const fs = require('fs');
const { Worker } = require('worker_threads')
const { execw } = require('../run/getMrz');

// let records = [];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // file.originalname
        cb(null, 'data/imageDir') // Uploads folder
        // cb("file ex", 'data/imageDir') // Uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }

});



const upload = multer({ storage: storage })

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


//Get all students
router.get('/', (req, res) => {
  res.send('App is running..');
});


router.post('/getPassportDetails', upload.single('myFile'), async (req, res) => {


    if (!req.file) {
        res.status(400).json({
            erorr: "No File"
        })
        return
    }

    const isExtVaild = req.file.filename.endsWith('jpg') || req.file.filename.endsWith('png') || req.file.filename.endsWith('jpeg')

    if (!isExtVaild) {

        fs.rm(`../data/imageDir/${req.file.originalname}`, (deleteErr) => {
            if (deleteErr) {
                console.log('deleteErr')
            }
        })

        res.status(400).json({
            erorr: "File Extention Not Supported only ( png | jpg | jpeg ) Supported."
        })
        return
    }


    try {

        await execw();
        const worker = new Worker('./run/readMrz.js');

        worker.on('error', e => {
            console.log('erorr', e)
        })


        worker.on('messageerror', e => {
            console.log('messageerror', e)
        })


        worker.on('message', msg => {


            if (typeof msg == "string") {
                res.status(400).json({
                    erorr: msg
                })
            } else {
                res.status(200).json({
                    data: msg
                })
            }
        })

        worker.on('exit', e => {
            console.log('exit')
            // console.log('exit', e)

            fs.rm('../data/imageDir/out', {
                recursive: true,
            }, (error) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("Recursive: Directories Deleted!");
                }
            })

            fs.rm(`data/imageDir/${req.file.originalname}`, (error) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("File Deleted!");
                }
            })
        })


    } catch (e) {
        console.log('eeee', e)
    }


})

//showing demo records
router.get('/demo', (req, res) => {
  res.json([
    {
      id: '001',
      name: 'Smith',
      email: 'smith@gmail.com',
    },
    {
      id: '002',
      name: 'Sam',
      email: 'sam@gmail.com',
    },
    {
      id: '003',
      name: 'lily',
      email: 'lily@gmail.com',
    },
  ]);
});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);