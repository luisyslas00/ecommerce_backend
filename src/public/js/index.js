document.addEventListener('DOMContentLoaded', async()=>{
    const containerTecno = document.getElementById('container__tecno')
    const containerMuebles = document.getElementById('container__muebles')
    const containerAlmacen = document.getElementById('container__almacen')
    try {
        const response = await fetch('/api/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        const products = result.payload
        // const productsTecno = products.filter(product => product.category === "tecno")
        // const productsAlmacen = products.filter(product => product.category === 'almacen')
        // const productsMuebles = products.filter(product => product.category === 'muebles')
        // lastFiveProducts.forEach(product => {
        //     const containerProduct = document.createElement('div');
        //     containerProduct.className = 'card__product';
        //     containerProduct.innerHTML = `
        //         <h3>${product.title}</h3>
        //         <p>Precio: ${product.price}</p>
        //         <p>Stock: ${product.stock}</p>
        //     `;
        //     container.appendChild(containerProduct); 
        // });
        mostrarProductos('tecno',containerTecno)
        mostrarProductos('muebles',containerMuebles)
        mostrarProductos('almacen',containerAlmacen)
        function mostrarProductos(filtro,container){
            const productsFilter = products.filter(product => product.category === filtro)
            const lastFiveProducts = productsFilter.slice(-4).reverse();
            lastFiveProducts.forEach(product => {
                const containerProduct = document.createElement('div');
                containerProduct.className = 'card__product';
                containerProduct.innerHTML = `
                    <h3 class="title_product">${product.title}</h3>
                    <img class="img_product" src="${product.thumbnail}">
                    <p class="price_product">$${product.price}</p>
                `;
                container.appendChild(containerProduct); 
            });
        }
   } catch (error) {
        console.log(error)
   }
});
