const fs = require('fs');

const saveToJson = (data) => {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync('./price.json', jsonData, 'utf8');

        console.log("Данные сохранены в price.json");
    } catch (error) {
        console.warn("Ошибка при сохранении данных в JSON файл: ", error)
    }
}

module.exports = { saveToJson }