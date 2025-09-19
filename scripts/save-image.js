const fs = require('fs');

const saveImage = async (data, fileName) => {
    // конвертируем Blob в Buffer
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFile(fileName, buffer, (err) => {
        if (err) throw err;
    });
}

module.exports = { saveImage }