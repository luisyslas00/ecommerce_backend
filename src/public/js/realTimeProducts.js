const socket = io()

//Capturamos elementos
const nameProduct = document.getElementById('name')
const descriptionProduct = document.getElementById('description')
const priceProduct = document.getElementById('price')
const thumbnailProduct = document.getElementById('thumbnail')
const codeProduct = document.getElementById('code')
const stockProduct = document.getElementById('stock')
const categoryProduct = document.getElementById('category')
const formProduct = document.getElementById('formulario')
const productsContainer = document.getElementById('products')


//Función formulario

function enviarFormulario(){
    const newProduct = {
        title:nameProduct.value,
        description:descriptionProduct.value,
        price:priceProduct.value,
        thumbnail:thumbnailProduct.value,
        code:codeProduct.value,
        stock:stockProduct.value,
        category:categoryProduct.value
    }
    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        console.log('Producto agregado:', data);
        socket.emit('addProducts',{newProduct})
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

formProduct.addEventListener('submit',(e)=>{
    e.preventDefault()
    enviarFormulario()
    socket.on("listaProductosActualizada", data =>{
        const productsDB = data.docs
        actualizarListaProductos(productsDB)
    })
    formProduct.reset()
})

// socket.on("listaProductos", data=>{
//     const prodDB = data.productsDB
//     console.log(prodDB)
//     productsContainer.innerHTML =''
//     prodDB.forEach(element => {
//         const containerProduct = document.createElement('div')
//         containerProduct.classList.add('card_product')
//         containerProduct.innerHTML =`
//         <p>${element.title}</p>
//         <p>${element.price}</p>
//         <button id=${element.id}>Eliminar</button>`
//         productsContainer.append(containerProduct)
//         const buttonEliminar = document.getElementById(`${element.id}`)
//         buttonEliminar.addEventListener('click',()=>{
//             socket.emit('productEliminar',{id:`${element.id}`})
//         })
//     })
// });

socket.on("listaProductos", data =>{
    const productsDB = data.docs
    actualizarListaProductos(productsDB)
})

function actualizarListaProductos(productsDB){
    productsContainer.innerHTML = ''
    productsDB.forEach(element=>{
        const containerProduct = document.createElement('div')
                containerProduct.classList.add('product_admin')
                containerProduct.innerHTML =`
                <p>${element.title}</p>
                <p>$${element.price}</p>
                <button id=${element.id}>Eliminar</button>`
                productsContainer.append(containerProduct)
                const buttonEliminar = document.getElementById(`${element.id}`)
                buttonEliminar.classList.add('btn_eliminar')
                buttonEliminar.addEventListener('click',async()=>{
                    console.log(`Eliminar ${element.id}`)
                    try {
                        const response = await fetch(`/api/products/${element.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        
                        if(response.ok) {
                            const result = await response.json()
                            console.log('Producto eliminado:', result)
                            // Elimina el producto de la lista
                            actualizarListaProductos(productsDB.filter(product => product.id !== element.id))
                        } else {
                            console.error('Error al eliminar el producto')
                        }
                    } catch (error) {
                        console.error('Error en la petición:', error)
                    }
                })
    })
}