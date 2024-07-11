const fs = require('fs');
function deleteAllFilesFormOS(req, forImage = false) {

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

    if (!forImage) {
        fs.rm(`data/imageDir/${req.file.originalname.replace(".pdf", "")}_page_1.png`, (error) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log("File Deleted!");
            }
        })
    }
}

module.exports = {
    deleteAllFilesFormOS
}