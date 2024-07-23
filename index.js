

const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // You can change this to any port you prefer
const multer = require('multer');
const fs = require('fs');
const { pdfToPng } = require('pdf-to-png-converter');
const { ExtractMRZFromImage } = require('./MRZfromImage');
const { Worker } = require("worker_threads");
const { passportCountries, extractCountryName } = require('./utils/Countries')
const { convertToDate } = require('./utils');
const { deleteAllFilesFormOS } = require('./utils/file');
const { getPassportDetails } = require('./utils/GPT');
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
        satus: "it's work",
    })
})


// documentCode: 'P',
// issuingState: 'United States of America',
// lastName: 'FIDEL',
// firstName: 'MICHAEL J',
// documentNumber: '561462352',
// documentNumberCheckDigit: '0',
// nationality: 'United States of America',
// birthDate: '20,10,1956',
// birthDateCheckDigit: '0',
// sex: 'male',
// expirationDate: '12,02,2028',
// expirationDateCheckDigit: '7',
// personalNumber: '717088837 5212',
// personalNumberCheckDigit: '3',
// compositeCheckDigit: '6',
// orignalBirthDate: '561020',
// orignalexpirationDate: '280212',
// nationalityCode: 'USA',
// issuingStateCode: 'USA',
// fullName: 'MICHAEL J FIDEL'

app.post('/gpt/images', upload.single('myFile'), async (req, res) => {

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

    fs.readFile(__dirname + "/data/imageDir/" + req.file.filename, async (err, dta) => {
        if (err) {
            console.log('errr', err)
            return
        }

        try {
            const Response = await getPassportDetails(`data:${req.file.mimetype};base64,${dta.toString('base64')}`)
            deleteAllFilesFormOS(req, true)
            res.status(200).json({
                data: {
                    ...Response,
                    sex: Response.sex == "m" || Response.sex == "M" || Response.sex == "male" ? "male" : "female",
                    expirationDate: Response.expirationDate.includes('/') ? Response.expirationDate.replaceAll("/", ",") : Response.expirationDate,
                    birthDate: Response?.birthDate.includes('/') ? Response?.birthDate.replaceAll("/", ",") : Response?.birthDate,
                    nationality: extractCountryName(Response?.country),
                    countryState: extractCountryName(Response?.country_of_Issue),
                    issuingState: Response?.place_of_Issue
                }
            })
        } catch (e) {
            console.log("eeeee", e)
            res.status(200).json({
                ...e
            })
        }

    })

})




app.post('/gpt/pdf', upload.single('myFile'), async (req, res) => {


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


    fs.readFile(__dirname + "/data/imageDir/" + req.file.filename.replace(".pdf", "_page_1.png"), async (err, dta) => {
        if (err) {
            console.log('errr', err)
            return
        }

        try {
            const Response = await getPassportDetails(`data:image/png;base64,${dta.toString('base64')}`)
            deleteAllFilesFormOS(req, false)
            res.status(200).json({
                data: {
                    ...Response,
                    sex: Response.sex == "m" || Response.sex == "M" || Response.sex == "male" ? "male" : "female",
                    expirationDate: Response.expirationDate.includes('/') ? Response.expirationDate.replaceAll("/", ",") : Response.expirationDate,
                    birthDate: Response?.birthDate.includes('/') ? Response?.birthDate.replaceAll("/", ",") : Response?.birthDate,
                    nationality: extractCountryName(Response?.country),
                    countryState: extractCountryName(Response?.country_of_Issue),
                    issuingState: Response?.place_of_Issue
                }
            })
        } catch (e) {
            res.status(200).json({
                ...e
            })
        }

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
                const nationality = ms.nationality ? passportCountries.find(item => item.code === ms.nationality)?.name : null
                const issuingState = ms.issuingState ? passportCountries.find(item => item.code === ms.issuingState)?.name : null
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