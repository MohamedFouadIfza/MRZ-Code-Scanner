const { readMrz } = require('mrz-detection');
const { join, resolve, extname, parse: parsePath } = require('path');
const IJS = require('image-js').Image;
const { parse } = require('mrz');
const { readdir } = require('fs-extra')
const { parentPort } = require("worker_threads");

async function processFile(imagePath) {

    try {
        const parsedPath = parsePath(imagePath);
        const image = await IJS.load(imagePath);

        const result = await readMrz(image, {
            debug: false,
            saveName: join(parsedPath.dir, '../multiMask/', parsedPath.base)
        });
        const parsed = parse(result.mrz);

        return parsed
    } catch (err) {
        console.log('errrrrrrrrrrrrrr', err)
    }
}

async function readMRZFromImage() {

    try {
        const dirname = resolve('data/imageDir/out/crop');
        const files = (await readdir(dirname)).filter((f) => {
            f = f.toLowerCase();
            return f.endsWith('jpg') || f.endsWith('png') || f.endsWith('jpeg');
        });
        const file = files[0]
        const imagePath = join(dirname, file);

        const parses = await processFile(imagePath);
        parentPort.postMessage({ err: false, ...parses });
    } catch (er) {
        parentPort.postMessage({ err: true, errMsg: err });
    }
}

readMRZFromImage()