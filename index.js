

const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // You can change this to any port you prefer
const multer = require('multer');
const fs = require('fs');
const { Worker } = require('worker_threads')
const { execw } = require('./run/getMrz');
// const { detectQRCode } = require('./utils/QRCode')

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

 function convertToDate(dateString) {
    if (dateString.length !== 6) {
      throw new Error("Invalid date string format");
    }

    // Extract year, month, and day parts
    let year = parseInt(dateString.substring(0, 2), 10);
    let month = parseInt(dateString.substring(2, 4), 10) - 1; // Months are 0-indexed in JavaScript Date
    let day = parseInt(dateString.substring(5, 6), 10);

    if(year >= 50) {
      year += 1900;
    } else {
      year += 2000;
    }
    // Assuming the year is in the 1900s
    

    // Create and return the date
    return new Date(year, month, day);
  }



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

    if(req.file) {
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
               const expirationDate = msg.expirationDate ?  convertToDate(msg.expirationDate) : null;
                const birthDate = msg.birthDate ?  convertToDate(msg.birthDate) : null
                res.status(200).json({
                    data: {
                        ...msg,
                        expirationDate,
                        birthDate
                    } 
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
