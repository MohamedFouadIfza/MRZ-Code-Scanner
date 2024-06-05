

const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // You can change this to any port you prefer
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Worker } = require('worker_threads')
const { execw } = require('./run/getMrz');
// const { execm } = require('./run/readMrz');


// const storage = multer.memoryStorage()

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/getPassportDetails', upload.single('myFile'), async (req, res) => {


    if (!req.file) {
        res.status(400).json({
            erorr: "No File"
        })
        return
    }

    const isExtVaild = req.file.filename.endsWith('jpg') || req.file.filename.endsWith('png') || req.file.filename.endsWith('jpeg')

    if (!isExtVaild) {

        fs.rm(`data/imageDir/${req.file.originalname}`, (deleteErr) => {
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

            fs.rm('data/imageDir/out', {
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
