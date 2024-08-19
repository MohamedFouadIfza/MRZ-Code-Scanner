

const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // You can change this to any port you prefer
// const multer = require('multer');
const fs = require('fs');
// const { pdfToPng } = require('pdf-to-png-converter');
// const { ExtractMRZFromImage } = require('./MRZfromImage');
// const { Worker } = require("worker_threads");
// const { passportCountries, extractCountryName } = require('./utils/Countries')
// const { convertToDate, formateGPTDate } = require('./utils');
// const { deleteAllFilesFormOS } = require('./utils/file');
// const { getPassportDetails } = require('./utils/GPT');
// import { createWorker } from 'tesseract.js';
// const {  } = require('ocr-tools');
// var {  } = require('ocr');
const pdf = require('pdf-parse');
// tWWpWb2qhJNjUghmtlOawEn6SX6
// const { detectQRCode } = require('./utils/QRCode');
const path = require('path');
const { sendPassport, getApplicantActions, getApplicantReviewStatus, getApplicant, createApplicatntAction, fireOCR } = require('./sumSub');
const axios = require('axios').default
var env = process.env.NODE_ENV || 'development'
// const sharp = require('sharp');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'data/imageDir') // Uploads folder
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }

// });

// const upload = multer({ storage: storage })

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(express.static(path.join(__dirname, 'data')));
// app.use(express.static("convertedJson"));

// app.get('file', (req, res) => {
//     res.status(200).send()
// })
app.get('/convertedJson/:id', async (req, res) => {

    const filePath = path.join(__dirname, "convertedJson", `${req.params.id}.json`);
    console.log("yes", filePath)

    res.download(filePath, `${req.params.id}.json`, (err) => {
        if (err) {
            res.status(400).json({
                err
            })
            return
        }


    })
})

app.post('/convertjsontofile/:id', async (req, res) => {
    const id = req.params.id
    const json = req.body

    console.log("json", json)
    const filePath = path.join(__dirname, "convertedJson");

    const downloadPath = path.join(env == "development" ? "http://localhost:3000" : "https://mrz-code-scanner.onrender.com", "convertedJson", `${id}`);
    const data = JSON.stringify(json,null,2)
    console.log("dta", data)
    fs.writeFile(`${filePath}/${id}.json`, data, 'utf8', (err) => {
        if (err) {
            res.status(400).json({
                err
            })
            return
        }

        res.status(200).json({
            downloadURL: downloadPath
        })
    })


})
app.post('/sendPassport', async (req, res) => {

    const {
        applicantId,
        base64,
        fileName,
        country
    } = req.body

    const fileDIr = path.join(__dirname, "resources");

    fs.writeFile(`${fileDIr}/${fileName}`, base64, { encoding: "base64" }, (err) => {
        if (err) {
            console.log("errr", err)
            res.status(400).json({
                err
            })
            return
        }


        sendPassport(applicantId, `${fileDIr}/${fileName}`, {
            country,
            idDocType: "PASSPORT"
        }).then((sentRes) => {

            setTimeout(() => {
                fireOCR(applicantId).then(() => {
                    res.status(200).json({
                        ...sentRes
                    })
                }).catch((fireOCREror) => {

                    console.log("fireOCREror", {
                        ...fireOCREror
                    })

                    res.status(400).json({
                        fireOCREror
                    })
                })
            }, 10000);

        }).catch((sendErr) => {
            console.log("sendErr", sendErr)
            if (sendErr?.data?.maxDataSize) {
                res.status(400).json({
                    err: "file is to large max file size is 209 kb"
                })
                return
            }
            res.status(400).json({
                err: sendErr?.data || ""
            })

        }).finally(() => {
            fs.rm(`${fileDIr}/${fileName}`, (err) => {
                if (err) {
                    res.status(400).json({
                        err
                    })
                    return
                }
                console.log("file deleted")
            })
        })

    })
    // fireOCR(applicantId).then((re) => { console.log("re", re.data) }).catch((er) => { console.log("er", er) })
    // getApplicant(applicantId).then((re) => {
    //     console.log("re", { ...re.data.info.idDocs })
    // }).catch((er) => { console.log("er", er) })

    // getApplicantReviewStatus(applicantId).then((re) => { console.log("re", re.data) }).catch((er) => { console.log("er", er) })

    // sendPassport(applicantId, {
    //     country: "NLD",
    //     idDocType: "PASSPORT"
    // }).then((res) => {
    //     console.log('res', res)
    // }).catch((er) => {
    //     console.log("er", er)
    // })

    // getApplicantReviewStatus(applicantId).then((re) => { console.log("re", re) }).catch((er) => { console.log("er", er) })

})

app.get('/', async (req, res) => {

    res.status(200).json({
        satus: "it's work",
    })
})



app.post('/ExtractMediaclCertificateInfo/pdf', async (req, res) => {


    try {
        const base64Data = req.body.image
        const visaID = req.body?.id || "default"

        let dataBuffer = Buffer.from(base64Data, 'base64')
        pdf(dataBuffer).then(function (data) {

            // The text content of the PDF
            const text = data.text;
            // Use regular expressions to extract the information
            const passportRegex = /Passport No\.\s*(\d+)/i;
            const fitnessResultRegex = /Medical Fitness Result\s*“\s*(\w+)\s*”/i;

            const passportRegex1 = /Passport No\.\s*(\w+)/i;
            const fitnessResultRegex1 = /Medical Fitness Result\s*“\s*(\w+)\s*”/i;

            const passportRegex2 = /Passport Number\s*(\w+)/i;
            const fitnessResultRegex2 = /Medically Fit|لائق طبياً/g;

            const passportRegex3 = /Passport No\.\s*(\w+)/i;
            const fitnessResultRegex3 = /Medical Fitness Result:\s*“\s*(\w+)\s*”/i;

            const wordRegex2 = /لائق طبيا/g;
            ////////////////////////////////////////////////////////

            const passportMatch = text.match(passportRegex);
            const fitnessResultMatch = text.match(fitnessResultRegex);

            const passportMatch1 = text.match(passportRegex1);
            const fitnessResultMatch1 = text.match(fitnessResultRegex1);

            const passportMatch2 = text.match(passportRegex2);
            const fitnessResultMatch2 = text.match(fitnessResultRegex2);

            const matchDoc1 = text.match(wordRegex2);

            const passportMatch3 = text.match(passportRegex3);
            const fitnessResultMatch3 = text.match(fitnessResultRegex3);



            if (passportMatch3 && fitnessResultMatch3) {
                console.log("goverment of dubai", visaID)
                const passportNumber = passportMatch3[1];
                const medicalFitnessResult = fitnessResultMatch3[1];
                res.status(200).json({
                    passportNum: passportNumber,
                    result: medicalFitnessResult
                })
            } else if (passportMatch1 && fitnessResultMatch1) {
                console.log("Salem", visaID)
                const passportNumber = passportMatch1[1];
                const fitnessResult = fitnessResultMatch1[1];
                res.status(200).json({
                    passportNum: passportNumber,
                    result: fitnessResult
                })
            } else if (passportMatch && fitnessResultMatch) {
                console.log("third doc", visaID)
                const passportNumber = passportMatch[1];
                const fitnessResult = fitnessResultMatch[1];

                res.status(200).json({
                    passportNum: passportNumber,
                    result: fitnessResult
                })
            } else if (passportMatch2 && fitnessResultMatch2) {
                console.log("Laiq arabic", visaID)
                const passportNumber = passportMatch2[1];
                const fitnessResult = fitnessResultMatch2[0];
                console.log("includted arabic and has passport")
                res.status(200).json({
                    passportNum: passportNumber,
                    result: fitnessResult.replace("Medically ", "").toUpperCase()
                })
            } else if (matchDoc1) {
                console.log("EHC arabic without passport number", visaID)
                res.status(200).json({
                    passportNum: "0",
                    result: "FIT"
                })
                // passportNum: "No Passport Number",
            } else {
                res.status(200).json({
                    passportNum: "0"
                })
                // passportNum: "image resolution is not good or worng file"
                console.log('image resolution is not good', visaID);
            }
        });

    } catch (e) {
        res.status(500).json({
            erorr: e
        })
        console.log('eeee', e)
    }

});


// app.post('/ExtractMediaclCertificateInfo', upload.single('certificate'), async (req, res) => {


//     console.log('file', req.file)
//     if (!req.file) {
//         res.status(400).json({
//             erorr: "No File"
//         })
//         return
//     }
//     const isPdf = req.file.path.includes(".pdf")

//     const filePath = isPdf ? req.file.path.replace(".pdf", "_page_1.png") : req.file.path

//     console.log('imagepath', req.file.path)
//     try {
//         if (isPdf) {
//             await pdfToPng(`${req.file.path}`, { outputFolder: "./data/imageDir", disableFontFace: false, viewportScale: 2, pagesToProcess: [1] })
//         }

//         detectQRCode(filePath)
//             .then(qrCode => {
//                 const qMarkIndedx = qrCode.indexOf('?')
//                 const qrCodeLink = qrCode.slice(qMarkIndedx, qrCode.length)
//                 const readerUrl = `https://salemsystem.dubaihealth.ae/revamp-portal/restapi/revamp/application/certificate/scan${qrCodeLink}`
//                 fetch(readerUrl).then((response) => {
//                     return response.json()
//                 }).then(({ data }) => {
//                     console.log("data.certificate", data.certificate)
//                     res.status(200).json({
//                         ...data.certificate
//                     })
//                 })
//             })
//             .catch(err => {
//                 res.status(200).json({
//                     of: err
//                 })
//             }).finally(() => {
//                 fs.rm(filePath, (err) => {
//                     if (err) {
//                         console.log('err', err)
//                     }
//                 })
//                 if (isPdf) {
//                     fs.rm(req.file.path, (err) => {
//                         if (err) {
//                             console.log('err', err)
//                         }
//                     })
//                 }
//             })
//     } catch (e) {
//         res.status(500).json({
//             erorr: e
//         })
//         console.log('eeee', e)
//     }

// });


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

// app.post('/gpt/images', upload.single('myFile'), async (req, res) => {

//     if (!req.file) {
//         res.status(400).json({
//             erorr: "No File"
//         })
//         return
//     }

//     if (req.file) {
//         console.log('file', req.file)
//     }

//     const isExtVaild = req.file.filename.endsWith('jpg') || req.file.filename.endsWith('png') || req.file.filename.endsWith('jpeg')

//     if (!isExtVaild) {

//         fs.rm(`data/imageDir/${req.file.originalname}`, (deleteErr) => {
//             if (deleteErr) {
//                 console.log('deleteErr')
//             }
//         })

//         res.status(400).json({
//             erorr: "File Extention Not Supported only ( png | jpg | jpeg ) Supported."
//         })
//         return
//     }

//     fs.readFile(__dirname + "/data/imageDir/" + req.file.filename, async (err, dta) => {
//         if (err) {
//             console.log('errr', err)
//             return
//         }

//         try {
//             const Response = await getPassportDetails(`data:${req.file.mimetype};base64,${dta.toString('base64')}`)
//             deleteAllFilesFormOS(req, true)

//             const data = {
//                 ...Response,
//                 sex: Response.sex == "m" || Response.sex == "M" || Response.sex == "male" ? "male" : "female",
//                 expirationDate: formateGPTDate(Response?.expirationDate),
//                 birthDate: formateGPTDate(Response?.birthDate),
//                 nationality: extractCountryName(Response?.nationality),
//                 countryState: extractCountryName(Response?.country_of_Issue),
//                 issuingState: Response?.placeOfIssue,
//             }
//             console.log("data", data)
//             res.status(200).json({
//                 data
//             })
//         } catch (e) {
//             console.log("eeeee", e)
//             res.status(200).json({
//                 ...e
//             })
//         }

//     })

// })




// app.post('/gpt/pdf', upload.single('myFile'), async (req, res) => {


//     if (!req.file) {
//         res.status(400).json({
//             erorr: "No File"
//         })
//         return
//     }

//     if (req.file) {
//         console.log('file', req.file)
//     }

//     const isExtVaild = req.file.filename.endsWith('pdf')

//     if (!isExtVaild) {

//         fs.rm(`data/imageDir/${req.file.originalname}`, (deleteErr) => {
//             if (deleteErr) {
//                 console.log('deleteErr')
//             }
//         })

//         res.status(400).json({
//             erorr: "File Extention Not Supported only pdf Supported."
//         })
//         return
//     }

//     try {
//         await pdfToPng(`data/imageDir/${req.file.originalname}`, { outputFolder: "./data/imageDir", disableFontFace: false, viewportScale: 2, pagesToProcess: [1] })
//     } catch (e) {
//         return res.status(400).json({
//             reason: "Convert To Image",
//             err: e
//         })
//     }


//     fs.readFile(__dirname + "/data/imageDir/" + req.file.filename.replace(".pdf", "_page_1.png"), async (err, dta) => {
//         if (err) {
//             console.log('errr', err)
//             return
//         }

//         try {
//             const Response = await getPassportDetails(`data:image/png;base64,${dta.toString('base64')}`)
//             deleteAllFilesFormOS(req, false)
//             const data = {
//                 ...Response,
//                 sex: Response.sex == "m" || Response.sex == "M" || Response.sex == "male" ? "male" : "female",
//                 expirationDate: formateGPTDate(Response?.expirationDate),
//                 birthDate: formateGPTDate(Response?.birthDate),
//                 nationality: extractCountryName(Response?.nationality),
//                 countryState: extractCountryName(Response?.country_of_Issue),
//                 issuingState: Response?.placeOfIssue,
//             }
//             console.log("data", data)
//             res.status(200).json({
//                 data
//             })
//         } catch (e) {
//             res.status(200).json({
//                 ...e
//             })
//         }

//     })

// })



// app.post('/getPassportDetails', upload.single('myFile'), async (req, res) => {

//     if (!req.file) {
//         res.status(400).json({
//             erorr: "No File"
//         })
//         return
//     }

//     if (req.file) {
//         console.log('file', req.file)
//     }

//     const isExtVaild = req.file.filename.endsWith('jpg') || req.file.filename.endsWith('png') || req.file.filename.endsWith('jpeg')

//     if (!isExtVaild) {

//         fs.rm(`data/imageDir/${req.file.originalname}`, (deleteErr) => {
//             if (deleteErr) {
//                 console.log('deleteErr')
//             }
//         })

//         res.status(400).json({
//             erorr: "File Extention Not Supported only ( png | jpg | jpeg ) Supported."
//         })
//         return
//     }

//     try {
//         await ExtractMRZFromImage()
//     } catch (e) {

//         deleteAllFilesFormOS(req, true)

//         if (e?.message) {
//             return res.status(400).json({
//                 reason: "Extract MRZ From Image",
//                 err: e?.message
//             })
//         }

//         return res.status(400).json({
//             reason: "Extract MRZ From Image",
//             err: e
//         })
//     }

//     try {
//         const file = __dirname + "/ReadMRZ.js";
//         const worker = new Worker(file);

//         worker.on("message", (msg) => {
//             const ms = msg.fields
//             if (msg.err) {
//                 return res.status(400).json({
//                     err: msg.errMsg
//                 })
//             } else {
//                 const expirationDate = ms.expirationDate ? convertToDate(ms.expirationDate, true) : null;
//                 const birthDate = ms.birthDate ? convertToDate(ms.birthDate) : null
//                 const nationality = ms.nationality ? passportCountries.find(item => item.code === ms.nationality)?.name : null
//                 const issuingState = ms.issuingState ? passportCountries.find(item => item.code === ms.issuingState)?.name : null
//                 let fullName = "";

//                 if (ms.firstName && ms.lastName) {
//                     fullName = ms.firstName + " " + ms.lastName
//                 }

//                 if (ms.firstName && ms.lastName == "") {
//                     fullName = ms.firstName
//                 }

//                 if (ms.firstName == "" && ms.lastName) {
//                     fullName = ms.lastName
//                 }

//                 const data = {
//                     ...ms,
//                     expirationDate,
//                     birthDate,
//                     orignalBirthDate: ms.birthDate,
//                     orignalexpirationDate: ms.expirationDate,
//                     nationalityCode: ms.nationality,
//                     nationality,
//                     issuingStateCode: ms.issuingState,
//                     issuingState,
//                     fullName
//                 }
//                 console.log('data', data)
//                 return res.status(200).json({
//                     data
//                 })
//             }
//         });

//         worker.on("error", (msg) => {
//             return res.status(400).json({
//                 Reason: "worker",
//                 err: msg
//             })
//         });

//         worker.on("exit", (code) => {
//             if (code !== 0) {
//                 console.log(`Worker stopped with exit code ${code}`)
//             };
//             deleteAllFilesFormOS(req, true)
//         });

//     } catch (e) {
//         console.log('lo', e)
//         deleteAllFilesFormOS(req, true)
//         return res.status(400).json({
//             Reason: "unknown",
//             err: e
//         })
//     }

// })

// app.post('/getPassportDetails/pdf', upload.single('myFile'), async (req, res) => {


//     if (!req.file) {
//         res.status(400).json({
//             erorr: "No File"
//         })
//         return
//     }

//     if (req.file) {
//         console.log('file', req.file)
//     }

//     const isExtVaild = req.file.filename.endsWith('pdf')

//     if (!isExtVaild) {

//         fs.rm(`data/imageDir/${req.file.originalname}`, (deleteErr) => {
//             if (deleteErr) {
//                 console.log('deleteErr')
//             }
//         })

//         res.status(400).json({
//             erorr: "File Extention Not Supported only pdf Supported."
//         })
//         return
//     }

//     try {
//         await pdfToPng(`data/imageDir/${req.file.originalname}`, { outputFolder: "./data/imageDir", disableFontFace: false, viewportScale: 2, pagesToProcess: [1] })
//     } catch (e) {
//         return res.status(400).json({
//             reason: "Convert To Image",
//             err: e
//         })
//     }

//     try {
//         await ExtractMRZFromImage()
//     } catch (e) {

//         deleteAllFilesFormOS(req)

//         if (e?.message) {
//             return res.status(400).json({
//                 reason: "Extract MRZ From Image",
//                 err: e?.message
//             })
//         }

//         return res.status(400).json({
//             reason: "Extract MRZ From Image",
//             err: e
//         })
//     }

//     try {
//         const file = __dirname + "/ReadMRZ.js";
//         const worker = new Worker(file);

//         worker.on("message", (msg) => {
//             // deleteAllFilesFormOS(req)
//             const ms = msg.fields
//             if (msg.err) {
//                 return res.status(400).json({
//                     err: msg.errMsg
//                 })
//             } else {
//                 const expirationDate = ms.expirationDate ? convertToDate(ms.expirationDate, true) : null;
//                 const birthDate = ms.birthDate ? convertToDate(ms.birthDate) : null
//                 const nationality = ms.nationality ? passportCountries.find(item => item.code === ms.nationality).name : null
//                 const issuingState = ms.issuingState ? passportCountries.find(item => item.code === ms.issuingState).name : null
//                 let fullName = "";

//                 if (ms.firstName && ms.lastName) {
//                     fullName = ms.firstName + " " + ms.lastName
//                 }

//                 if (ms.firstName && ms.lastName == "") {
//                     fullName = ms.firstName
//                 }

//                 if (ms.firstName == "" && ms.lastName) {
//                     fullName = ms.lastName
//                 }

//                 const data = {
//                     ...ms,
//                     expirationDate,
//                     birthDate,
//                     orignalBirthDate: ms.birthDate,
//                     orignalexpirationDate: ms.expirationDate,
//                     nationalityCode: ms.nationality,
//                     nationality,
//                     issuingStateCode: ms.issuingState,
//                     issuingState,
//                     fullName
//                 }
//                 console.log('data', data)
//                 return res.status(200).json({
//                     data
//                 })
//             }
//         });

//         worker.on("error", (msg) => {
//             return res.status(400).json({
//                 Reason: "worker",
//                 err: msg
//             })
//         });

//         worker.on("exit", (code) => {
//             if (code !== 0) {
//                 console.log(`Worker stopped with exit code ${code}`)
//             };
//             deleteAllFilesFormOS(req)
//         });

//     } catch (e) {
//         console.log('lo', e)
//         deleteAllFilesFormOS(req)
//         return res.status(400).json({
//             Reason: "unknown",
//             err: e
//         })
//     }

// })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});