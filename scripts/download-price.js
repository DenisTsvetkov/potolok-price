const { saveImage } = require('./save-image')

const url = 'https://online.sbis.ru/oauth/service/';

const app_client_id = '4039125485564887';
const app_secret = 'UFEA51TUJLT6QQ8D8MDIQDEN';
const secret_key = '0C0VliyzZxZLxmIjJsnrbya8gxFyhXqnasqqI2mC5TvEHCbBtQwesZ6DwsQeHnnbqGoMTXviy80w7wOVWElkFuphRQqphon7oHMY2BiUKEt6jdATtskfVN';
const actual_date = '20.09.2035';

const downloadPrice = async () => {
    console.info("Подключаемся к серверу СБИС")
    const body = {
        app_client_id,
        app_secret,
        secret_key
    }

    let authResponse;

    try {
        const result = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });

        authResponse = await result.json();
    } catch (error) {
        console.warn('Не получилось авторизоваться со СБИС. Ошибка: ', error);
    }

    const sid = authResponse?.sid;
    const accessToken = authResponse?.access_token;

    console.info("Получаем список точек продаж")
    // Получаем список точек продаж
    const pointsResult = await fetch('https://api.sbis.ru/retail/point/list', {
        headers: {
            "X-SBISAccessToken": accessToken,
            "X-SBISSessionId": sid,
        }
    });

    const points = await pointsResult.json();

    console.info("Получаем id точки продаж")
    // Получаем id точки продаж
    const pointId = points?.salesPoints?.[0]?.id;

    console.info("Получаем прайс-лист")
    // Получаем прайс-лист
    const priceListParams = new URLSearchParams({
        pointId,
        actualDate: actual_date,
    })

    const priceListResult = await fetch('https://api.sbis.ru/retail/nomenclature/price-list?' + priceListParams, {
        headers: {
            "X-SBISAccessToken": accessToken,
            "X-SBISSessionId": sid,
        },
    })

    const priceLists = await priceListResult.json();

    const priceListId = priceLists?.priceLists?.[0]?.id;

    console.info("Получаем каталог товаров")
    // Получаем каталог товаров
    const catalogParams = new URLSearchParams({
        pointId,
        priceListId,
        pageSize: 300,
    })

    const catalogResult = await fetch('https://api.sbis.ru/retail/nomenclature/list?' + catalogParams, {
        headers: {
            "X-SBISAccessToken": accessToken,
            "X-SBISSessionId": sid,
        },
    })

    const catalog = await catalogResult.json();
    const nomenclatures = catalog?.nomenclatures;

    console.info("Сформировываем коллекцию разделов")
    // Сформировываем коллекцию разделов
    const sections = nomenclatures.reduce((result, item) => {
        const hierarchicalId = item.hierarchicalId;
        const name = item.name;

        const externalId = item.externalId;
        if (externalId) {
            return result;
        }

        result[hierarchicalId] = {
            hierarchicalId,
            name,
            goods: []
        }

        return result;
    }, {})

    for (let i = 0; i < nomenclatures.length; i++) {
        const item = nomenclatures?.[i];

        if (!item.externalId) {
            continue;
        }

        const { id, name, cost, unit, hierarchicalParent, images } = item;

        let image = null;

        if (images) {
            const imageUrl = images?.[0];

            const imageResult = await fetch('https://api.sbis.ru/retail' + imageUrl, {
                headers: {
                    "X-SBISAccessToken": accessToken,
                    "X-SBISSessionId": sid,
                },
            })

            image = await imageResult.blob();

            if (image) {
                await saveImage(image, `./images/${id}.jpg`)
            }
        }


        sections[hierarchicalParent].goods.push({
            id, name, cost, unit, image: `./images/${id}.jpg`
        })
    }

    return sections
}

module.exports = { downloadPrice }