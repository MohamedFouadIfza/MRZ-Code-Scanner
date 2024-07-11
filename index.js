

const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // You can change this to any port you prefer
const multer = require('multer');
const fs = require('fs');
const { pdfToPng } = require('pdf-to-png-converter');
const { ExtractMRZFromImage } = require('./MRZfromImage');
const { Worker } = require("worker_threads");
const { passportCountries } = require('./utils/Countries')
const { convertToDate } = require('./utils');
const { deleteAllFilesFormOS } = require('./utils/file');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'data/imageDir') // Uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }

});

const upload = multer({ storage: storage })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', async (req, res) => {

    res.status(200).json({
        satus: "it's work"
    })
})



app.post('/getPassportDetails', upload.single('myFile'), async (req, res) => {

    if (!req.file) {
        res.status(400).json({
            erorr: "No File"
        })
        return
    }

    if (req.file) {
        console.log('file', req.file)
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
        await ExtractMRZFromImage()
    } catch (e) {

        deleteAllFilesFormOS(req, true)

        if (e?.message) {
            return res.status(400).json({
                reason: "Extract MRZ From Image",
                err: e?.message
            })
        }

        return res.status(400).json({
            reason: "Extract MRZ From Image",
            err: e
        })
    }

    try {
        const file = __dirname + "/ReadMRZ.js";
        const worker = new Worker(file);

        worker.on("message", (msg) => {
            const ms = msg.fields
            if (msg.err) {
                return res.status(400).json({
                    err: msg.errMsg
                })
            } else {
                const expirationDate = ms.expirationDate ? convertToDate(ms.expirationDate, true) : null;
                const birthDate = ms.birthDate ? convertToDate(ms.birthDate) : null
                const nationality = ms.nationality ? passportCountries.find(item => item.code === ms.nationality).name : null
                const issuingState = ms.issuingState ? passportCountries.find(item => item.code === ms.issuingState).name : null
                let fullName = "";

                if (ms.firstName && ms.lastName) {
                    fullName = ms.firstName + " " + ms.lastName
                }

                if (ms.firstName && ms.lastName == "") {
                    fullName = ms.firstName
                }

                if (ms.firstName == "" && ms.lastName) {
                    fullName = ms.lastName
                }

                const data = {
                    ...ms,
                    expirationDate,
                    birthDate,
                    orignalBirthDate: ms.birthDate,
                    orignalexpirationDate: ms.expirationDate,
                    nationalityCode: ms.nationality,
                    nationality,
                    issuingStateCode: ms.issuingState,
                    issuingState,
                    fullName
                }
                console.log('data', data)
                return res.status(200).json({
                    data
                })
            }
        });

        worker.on("error", (msg) => {
            return res.status(400).json({
                Reason: "worker",
                err: msg
            })
        });

        worker.on("exit", (code) => {
            if (code !== 0) {
                console.log(`Worker stopped with exit code ${code}`)
            };
            deleteAllFilesFormOS(req, true)
        });

    } catch (e) {
        console.log('lo', e)
        deleteAllFilesFormOS(req, true)
        return res.status(400).json({
            Reason: "unknown",
            err: e
        })
    }

})

app.post('/getPassportDetails/pdf', upload.single('myFile'), async (req, res) => {


    if (!req.file) {
        res.status(400).json({
            erorr: "No File"
        })
        return
    }

    if (req.file) {
        console.log('file', req.file)
    }

    const isExtVaild = req.file.filename.endsWith('pdf')

    if (!isExtVaild) {

        fs.rm(`data/imageDir/${req.file.originalname}`, (deleteErr) => {
            if (deleteErr) {
                console.log('deleteErr')
            }
        })

        res.status(400).json({
            erorr: "File Extention Not Supported only pdf Supported."
        })
        return
    }

    try {
        await pdfToPng(`data/imageDir/${req.file.originalname}`, { outputFolder: "./data/imageDir", disableFontFace: false, viewportScale: 2, pagesToProcess: [1] })
    } catch (e) {
        return res.status(400).json({
            reason: "Convert To Image",
            err: e
        })
    }

    try {
        await ExtractMRZFromImage()
    } catch (e) {

        deleteAllFilesFormOS(req)

        if (e?.message) {
            return res.status(400).json({
                reason: "Extract MRZ From Image",
                err: e?.message
            })
        }

        return res.status(400).json({
            reason: "Extract MRZ From Image",
            err: e
        })
    }

    try {
        const file = __dirname + "/ReadMRZ.js";
        const worker = new Worker(file);

        worker.on("message", (msg) => {
            // deleteAllFilesFormOS(req)
            const ms = msg.fields
            if (msg.err) {
                return res.status(400).json({
                    err: msg.errMsg
                })
            } else {
                const expirationDate = ms.expirationDate ? convertToDate(ms.expirationDate, true) : null;
                const birthDate = ms.birthDate ? convertToDate(ms.birthDate) : null
                const nationality = ms.nationality ? passportCountries.find(item => item.code === ms.nationality).name : null
                const issuingState = ms.issuingState ? passportCountries.find(item => item.code === ms.issuingState).name : null
                let fullName = "";

                if (ms.firstName && ms.lastName) {
                    fullName = ms.firstName + " " + ms.lastName
                }

                if (ms.firstName && ms.lastName == "") {
                    fullName = ms.firstName
                }

                if (ms.firstName == "" && ms.lastName) {
                    fullName = ms.lastName
                }

                const data = {
                    ...ms,
                    expirationDate,
                    birthDate,
                    orignalBirthDate: ms.birthDate,
                    orignalexpirationDate: ms.expirationDate,
                    nationalityCode: ms.nationality,
                    nationality,
                    issuingStateCode: ms.issuingState,
                    issuingState,
                    fullName
                }
                console.log('data', data)
                return res.status(200).json({
                    data
                })
            }
        });

        worker.on("error", (msg) => {
            return res.status(400).json({
                Reason: "worker",
                err: msg
            })
        });

        worker.on("exit", (code) => {
            if (code !== 0) {
                console.log(`Worker stopped with exit code ${code}`)
            };
            deleteAllFilesFormOS(req)
        });

    } catch (e) {
        console.log('lo', e)
        deleteAllFilesFormOS(req)
        return res.status(400).json({
            Reason: "unknown",
            err: e
        })
    }

})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});