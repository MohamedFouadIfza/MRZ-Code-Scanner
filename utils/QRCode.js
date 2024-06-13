


// // certLink
// // https://salemsystem.dubaihealth.ae/revamp-portal/#/public/certificate/view?qrcode=0U9SmGOFlP2n7CqZ7YKVNfeEmjUmowOGyDaDtyfpecs%3D
// // https://salemsystem.dubaihealth.ae/revamp-portal/restapi/revamp/application/certificate/scan?qrcode=0U9SmGOFlP2n7CqZ7YKVNfeEmjUmowOGyDaDtyfpecs%3D

// async function detectQRCode(imagePath) {
//     try {
//         // Load the image
//         const image = await Jimp.read(imagePath);
//         console.log(`Image loaded: ${imagePath}`);

//         // Preprocess the image if needed
//         image.grayscale(); // Convert to grayscale
//         image.contrast(1); // Increase contrast

//         // Get image dimensions
//         const { width, height } = image.bitmap;

//         // Convert the image to a pixel array
//         const imageData = {
//             data: new Uint8ClampedArray(image.bitmap.data.buffer),
//             width,
//             height,
//         };

//         // Use jsQR to detect the QR code
//         const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

//         console.log('qr', qrCode)
//         if (qrCode) {
//             // Get the top-left corner of the QR code
//             // const position = qrCode.location.topRightCorner;
//             // console.log('qrCode', qrCode)
//             // console.log(`QR Code detected at x: ${position.x}, y: ${position.y}`);
//             return qrCode.data;
//         } else {
//             console.log('No QR Code detected.');
//             return null;
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// module.exports = {
//     detectQRCode
// }