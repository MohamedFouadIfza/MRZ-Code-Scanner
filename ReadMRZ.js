const { readMrz } = require('mrz-detection');
const { join, resolve, extname, parse: parsePath } = require('path');
const IJS = require('image-js').Image;
const { parse } = require('mrz');
const { readdir } = require('fs-extra')

async function processFile(imagePath) {

    try {
        const parsedPath = parsePath(imagePath);
        const result = await readMrz(await IJS.load(imagePath), {
            debug: false,
            saveName: join(parsedPath.dir, '../multiMask/', parsedPath.base)
        });
        const parsed = parse(result.mrz);
    
        return parsed
    } catch(err) {
        console.log('errrrrrrrrrrrrrr', err)
    }
   
    // try {

    // } catch (e) {
    //     console.log('read error', e.message, e.stack);
    // }
}

async function readMRZFromImage() {

    const dirname = resolve('data/imageDir/out/crop');
    const files = (await readdir(dirname)).filter((f) => {
        f = f.toLowerCase();
        return f.endsWith('jpg') || f.endsWith('png') || f.endsWith('jpeg');
    });

    const res = []
    const file = files[0]
    const imagePath = join(dirname, file);

        const parses = await processFile(imagePath);
        console.log('per',parses)
    // for (let file of files) {
    //     console.log(`read process ${file}`);
    //     const imagePath = join(dirname, file);
    //     // const parses = await processFile(imagePath);
    //     // res.push(parses)
    // }
    return res;
}

module.exports = {
    readMRZFromImage
}