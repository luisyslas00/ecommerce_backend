const socket = io()

//Capturamos elementos
const nameProduct = document.getElementById('name')
const descriptionProduct = document.getElementById('description')
const priceProduct = document.getElementById('price')
const thumbnailProduct = document.getElementById('thumbnail')
const codeProduct = document.getElementById('code')
const stockProduct = document.getElementById('stock')
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
        stock:stockProduct.value
    }
    socket.emit('addProduct',{newProduct})
}

formProduct.addEventListener('submit',(e)=>{
    e.preventDefault()
    enviarFormulario()
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
    console.log(data)
    productsContainer.innerHTML = ''
    productsDB.forEach(element=>{
        const containerProduct = document.createElement('div')
                containerProduct.classList.add('card_product')
                containerProduct.innerHTML =`
                <p>${element.title}</p>
                <p>${element.price}</p>
                <button id=${element.id}>Eliminar</button>`
                productsContainer.append(containerProduct)
                const buttonEliminar = document.getElementById(`${element.id}`)
    })
})