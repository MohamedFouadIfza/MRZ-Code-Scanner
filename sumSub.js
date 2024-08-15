const crypto = require('crypto')
const axios = require('axios');
const secretKey = process.env.secretKey
const token = process.env.token 

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// var config = {};
// config.baseURL = SUMSUB_BASE_URL;


// axios.interceptors.request.use(createSignature, function (error) {
//     return Promise.reject(error);
// })

// function addDocument(applicantId) {
//     console.log("Adding document to the applicant...");

//     var method = 'post';
//     var url = `/resources/applicants/${applicantId}/info/idDoc`;
//     var filePath = 'resources/sumsub-logo.png';

//     var metadata = {
//         idDocType: 'PASSPORT',
//         country: 'GBR'
//     };

//     var form = new FormData();
//     form.append('metadata', JSON.stringify(metadata));

//     var content = fs.readFileSync(filePath);
//     form.append('content', content, filePath);

//     /*
//     In case you'd like to upload images in base64 encoded string format:

//     var content = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABCUExURUxpcSMudAGjmiIwdiEtdSIwdCMxdSMwdSMwdQGmlyMvdSFPfQOnmCMvdSMwdSMwdQGjmiMwdQGjmgGjmiMwdQGjmlncPbUAAAAUdFJOUwAw5lQRH0PM8CGpBhC81eBrftK5jzDo3gAAAAlwSFlzAAABwAAAAcABl8K+3QAAAuRJREFUeNrtm9typCAURXFEdMRLm6T//1fnId4qfUKDomLNWo8pwLOq7WwP0koBAAAAAAAAAAD8xzz+BPJIq377DMbeXaBBAAEEEIhHc3eBR7hAEkn2+Bhz9bmBcerH41Z3flqZ3MQRaBBAAAEEEEAAAQQQQAABBO7QCV/YHc/978IzEi8LH9EnN89Tid8n/z1XoEEAAQQQuPTf6AHp/Hlm/Z8BhQ1d/4PSyDfRiYgFmLb8yaBU8fVKqZKkFUotVCb8tU9ToBNKzRBAAAEEEhQY0hQY3gkMWfGNSpSxvGyQBXp1G3pRoLuPQIcAAgggcCnlSsCWieevM5M7q5Qd802vBuSv3aeT1vjNXY8zodfIVwVmI7/sAeuvUFa3X+UaV0lp6ov2f+YIXnspzLoHeoqKFAgggAACCCQhUJvvGDRtHIF2Wq8+SWDO7yyOwFyYrU4RqIRHjl0C2vO2QgABBBDYL2CFYm10AXEjW+qq5n66XjpFt8DSF86p1Xqmc8imgzbf5J1bwI7jjJ074XdPCN3U4S5z3QJdPo7TagOZW0B5Zqi0itSPV+IbgF078p4C4dsAYote7bvzEUAAAQR2CvTRBaRMroVhebhALixT78tfVyavsK870Z3QMUuY9ZmldiQXkn1BqwMR89d5Re2byeegPb8hK/ZtmyOAAAII7BWokheo3VPqVAXm/H2XfUImJyFgd8xNQaAKn4wAAggggICJI5CfXnc9drNVHIGpO67NOfVLnfA+gZO74w3PoGk9WCOAAAIIXNsdb+iEJdojBUw9UrgF2vx1x9o7D6d30W+642KqJSCn9fzxlid0s2/Wm/2qLWen+9jPoO5vg1Rit+uwBwIIIIDAFQK293snHF3A+e64D0hLnY/YOZMXquMEqterGTvVsik1te9vkuIIxO+Tfc8vHidwwGEPBBBAAIHzBKzzN6d1HIE21olpZyZLRNqLta5rXPfyAAAAAAAAAAAAAH7nHygtt70j9IRfAAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC'
//     var ext = content.substring("data:image/".length, content.indexOf(";base64"));
//     var fileName = `image.${ext}`;
//     var base64Data = content.split(',')[1];
//     form.append('content', Buffer.from(base64Data, 'base64'), { fileName });
//     */

//     var headers = {
//         'Accept': 'application/json',
//         'X-App-Token': SUMSUB_APP_TOKEN
//     };

//     config.method = method;
//     config.url = url;
//     config.headers = Object.assign(headers, form.getHeaders());
//     config.data = form;

//     return config;
// }

// function createSignature() {
//     console.log('Creating a signature for the request...');
//     var ts = Math.floor(Date.now() / 1000);
//     const signature = crypto.createHmac('sha256', SUMSUB_SECRET_KEY);
//     signature.update(ts + config.method.toUpperCase() + config.url);

//     if (config.data instanceof FormData) {
//         signature.update(config.data.getBuffer());
//     } else if (config.data) {
//         signature.update(config.data);
//     }

//     config.headers['X-App-Access-Ts'] = ts;
//     config.headers['X-App-Access-Sig'] = signature.digest('hex');

//     return config;
// }


async function sendPassport(applicantId, filePath, metadata = { idDocType: 'PASSPORT', country: 'NLD' }) {

    // var filePath = path.join(__dirname, 'resources', 'Passport-NSPR0LK71-CHRISTIAAN.pdf') //'resources/Passport-NSPR0LK71-CHRISTIAAN.pdf';

    var form = new FormData();
    form.append('metadata', JSON.stringify(metadata));

    var content = fs.readFileSync(filePath);
    form.append('content', content, filePath);

    const stamp = Math.floor(Date.now() / 1000).toString();
    const valueToSign = stamp + `POST/resources/applicants/${applicantId}/info/idDoc`;
    const hash = crypto.createHmac('SHA256', secretKey).update(valueToSign).update(form.getBuffer()).digest('hex');



    const options = {
        method: 'POST',
        url: `https://api.sumsub.com/resources/applicants/${applicantId}/info/idDoc`,
        headers: {
            'X-App-Token': token,
            "X-App-Access-Sig": hash,
            "X-App-Access-Ts": stamp,
            'Accept': 'application/json',
        },
        data: form
    };

    const res = await axios(options)
    return res
}
// https://api.sumsub.com/resources/applicants/{applicantId}/one

async function getApplicantReviewStatus(applicantId) {

    // var filePath = path.join(__dirname, 'resources', 'Passport-NSPR0LK71-CHRISTIAAN.pdf') //'resources/Passport-NSPR0LK71-CHRISTIAAN.pdf';

    const stamp = Math.floor(Date.now() / 1000).toString();
    const valueToSign = stamp + `GET/resources/applicants/${applicantId}/status`;
    // const valueToSign = stamp + `GET/resources/applicantActions`;
    const hash = crypto.createHmac('SHA256', secretKey).update(valueToSign).digest('hex');



    const options = {
        method: 'GET',
        url: `https://api.sumsub.com/resources/applicants/${applicantId}/status`,
        headers: {
            'X-App-Token': token,
            "X-App-Access-Sig": hash,
            "X-App-Access-Ts": stamp,
            'Accept': 'application/json',
        },
    };

    const res = await axios(options)
    return res
}

async function getApplicantActions(applicantId) {

    // var filePath = path.join(__dirname, 'resources', 'Passport-NSPR0LK71-CHRISTIAAN.pdf') //'resources/Passport-NSPR0LK71-CHRISTIAAN.pdf';

    const stamp = Math.floor(Date.now() / 1000).toString();
    const valueToSign = stamp + `GET/resources/applicantActions/-;applicantId=${applicantId}?limit=1000&offset=0`;
    // const valueToSign = stamp + `GET/resources/applicantActions`;
    const hash = crypto.createHmac('SHA256', secretKey).update(valueToSign).digest('hex');



    const options = {
        method: 'GET',
        url: `https://api.sumsub.com/resources/applicantActions/-;applicantId=${applicantId}?limit=1000&offset=0`,
        headers: {
            'X-App-Token': token,
            "X-App-Access-Sig": hash,
            "X-App-Access-Ts": stamp,
            'Accept': 'application/json',
        },
    };

    const res = await axios(options)
    return res
}


async function getApplicant(applicantId) {

    // var filePath = path.join(__dirname, 'resources', 'Passport-NSPR0LK71-CHRISTIAAN.pdf') //'resources/Passport-NSPR0LK71-CHRISTIAAN.pdf';

    const stamp = Math.floor(Date.now() / 1000).toString();
    const valueToSign = stamp + `GET/resources/applicants/${applicantId}/one`;
    // const valueToSign = stamp + `GET/resources/applicantActions`;
    const hash = crypto.createHmac('SHA256', secretKey).update(valueToSign).digest('hex');



    const options = {
        method: 'GET',
        url: `https://api.sumsub.com/resources/applicants/${applicantId}/one`,
        headers: {
            'X-App-Token': token,
            "X-App-Access-Sig": hash,
            "X-App-Access-Ts": stamp,
            'Accept': 'application/json',
        },
    };

    const res = await axios(options)
    return res
}




async function fireOCR(applicantId) {

    // var filePath = path.join(__dirname, 'resources', 'Passport-NSPR0LK71-CHRISTIAAN.pdf') //'resources/Passport-NSPR0LK71-CHRISTIAAN.pdf';


    const stamp = Math.floor(Date.now() / 1000).toString();
    const valueToSign = stamp + `POST/resources/applicants/${applicantId}/status/pending`;
    // const valueToSign = stamp + `GET/resources/applicantActions`;
    const hash = crypto.createHmac('SHA256', secretKey).update(valueToSign).digest('hex');

    // https://api.sumsub.com/resources/applicants/${applicantId}/status/pending

    const options = {
        method: 'POST',
        url: `https://api.sumsub.com/resources/applicants/${applicantId}/status/pending`,
        headers: {
            'X-App-Token': token,
            "X-App-Access-Sig": hash,
            "X-App-Access-Ts": stamp,
            'Accept': 'application/json',
        }
    };

    const res = await axios(options)
    return res
}

module.exports = {
    sendPassport,
    getApplicantActions,
    getApplicantReviewStatus,
    getApplicant,
    fireOCR
}