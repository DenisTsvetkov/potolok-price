const { downloadPrice } = require('./download-price.js')
const { saveToJson } = require('./save-to-json.js')

async function updatePrice () {
    const price = await downloadPrice()
    saveToJson(price)
}

updatePrice()
