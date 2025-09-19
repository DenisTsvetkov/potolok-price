fetch('price.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("price");

        // Перебираем категории
        Object.values(data).forEach(category => {
            const categoryDiv = document.createElement("div");
            categoryDiv.className = "category";

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
                <div class="price">${product.cost} ₽</div>
              </div>
            `);
            });

            categoryDiv.appendChild(productsDiv);
            container.appendChild(categoryDiv);
        });
    });