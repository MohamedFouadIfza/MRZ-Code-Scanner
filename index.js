

const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // You can change this to any port you prefer
const multer = require('multer');
const fs = require('fs');
const { Worker } = require('worker_threads')
const { execw } = require('./run/getMrz');
const { detectQRCode } = require('./utils/QRCode')

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


app.post('/ExtractMediaclCertificateInfo', upload.single('certificate'), async (req, res) => {
    const imagePath = req.file.path;
    
    if (!req.file) {
        res.status(400).json({
            erorr: "No File"
        })
        return
    }
    
    detectQRCode(imagePath)
        .then(qrCode => {
            const qMarkIndedx = qrCode.indexOf('?')
            const qrCodeLink = qrCode.slice(qMarkIndedx, qrCode.length)
            const readerUrl = `https://salemsystem.dubaihealth.ae/revamp-portal/restapi/revamp/application/certificate/scan${qrCodeLink}`

            fetch(readerUrl).then((response) => {
                return response.json()
            }).then(({ data }) => {
                res.status(200).json({
                    ...data.certificate
                })
            })
        })
        .catch(err => {
            res.status(200).json({
                of: err
            })
        }).finally(() => {
            fs.rm(imagePath, (err) => {
                if (err) {
                    console.log('err', err)
                }
            })
        })
});

//   read qr code if the image jsut a qr code
// app.post('/uploadQrCode', upload.single('image'), async (req, res) => {
//     const imagePath = req.file.path;

//     try {

//         console.log('Image uploaded:', imagePath);

//         // Load the image using canvas
//         const image = await loadImage(imagePath);
//         const canvas = createCanvas(image.width, image.height);
//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(image, 0, 0, image.width, image.height);
//         const imageData = ctx.getImageData(0, 0, image.width, image.height);

//         // Decode the QR code using jsQR
//         const code = jsQR(imageData.data, image.width, image.height);
//         if (!code) {
//             console.error('Error decoding QR code');
//             return res.status(500).send('Error reading QR code');
//         }

//         // Send the decoded QR code value as response
//         console.log('QR code decoded successfully:', code.data);
//         res.send(code.data);
//     } catch (err) {
//         console.error('Error processing image:', err);
//         res.status(500).send('Error processing image');
//     } finally {
//         // Clean up: remove the uploaded file
//         fs.unlinkSync(imagePath);
//     }
// });

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
