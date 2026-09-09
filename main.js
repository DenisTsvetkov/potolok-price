const orderCategories = [766, 767, 768, 770, 772, 773, 774, 775, 776, 777, 778, 796, 810]


fetch(`price.json?t=${Date.now()}`)
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