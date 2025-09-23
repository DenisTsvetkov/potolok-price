const orderCategories = [1350, 1344, 1342, 1353, 1348, 1347, 1345, 1346, 1349, 1351, 1383, 1352, 1371, 1343, 1656]


fetch('price.json')
    .then(res => res.json())
    .then(data => {
        const navigation = document.getElementById("navigation");
        const container = document.getElementById("price");

        // Перебираем категории
        orderCategories.forEach(categoryId => {
            const category = data?.[categoryId]

            const categoryDiv = document.createElement("div");
            categoryDiv.className = "category";
            categoryDiv.id = categoryId;

            // Добавляем ссылку на категорию в навигацию
            navigation.insertAdjacentHTML("beforeend", `
                <a href="#${categoryId}">${category?.name}</a>
            `)

            // Заголовок категории
            const title = document.createElement("h2");
            title.textContent = category.name;
            categoryDiv.appendChild(title);

            // Контейнер товаров
            const productsDiv = document.createElement("div");
            productsDiv.className = "products";

            // Перебор товаров
            category.goods.forEach(product => {
                productsDiv.insertAdjacentHTML("beforeend", `
              <div class="product-card">
                <img src="${product.image || 'https://hds.hel.fi/images/foundation/visual-assets/placeholders/image-m@3x.png'}" alt="${product.name}">
                <h3 class="product-title">${product.name}</h3>
                <div class="price">${product?.cost ?? "Не указана"} ₽ / ${product?.unit ?? ""}</div>
              </div>
            `);
            });

            categoryDiv.appendChild(productsDiv);
            container.appendChild(categoryDiv);
        });
    });