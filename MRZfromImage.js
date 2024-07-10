const library = require('mrz-detection')
const Image = require('image-js').Image
const { emptyDir, readdir, ensureDir } = require('fs-extra')
const path = require('path');

async function saveImages(imagePath, images, out) {
    const filename = path.basename(imagePath);
    const ext = path.extname(filename);
    const pngName = filename.replace(ext, '.png');
    for (const prefix in images) {
        const kind = path.join(out, prefix);
        await ensureDir(kind);
        await images[prefix].save(path.join(kind, pngName));
    }
}

async function ExtractMRZFromImage() {
    const dirname = path.resolve('data/imageDir');
    const files = (await readdir(dirname)).filter((f) => {
        f = f.toLowerCase();
        return f.endsWith('jpg') || f.endsWith('png') || f.endsWith('jpeg');
    });
    const out = path.join(dirname, 'out');
    await emptyDir(out);
    for (let file of files) {
        const imagePath = path.join(dirname, file);
        const result = {};
        library.getMrz(await Image.load(imagePath), {
            debug: true,
            out: result
        });
        await saveImages(imagePath, result, out);
    }
}

module.exports = {
    ExtractMRZFromImage
}