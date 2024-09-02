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
let userEmail = document.getElementById('userEmail').textContent

if(userEmail === 'adminCoder@coder.com'){
    userEmail = 'admin'
}

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


socket.on("listaProductos", data =>{
    const productsDB = data.docs
    actualizarListaProductos(productsDB)
})

function actualizarListaProductos(productsDB){
    productsContainer.innerHTML = ''
    productsDB.forEach(element=>{
        const containerProduct = document.createElement('div')
        containerProduct.className = 'product-container'
        if(element.owner === userEmail){
            containerProduct.classList.add('product_user')
        }else{
            containerProduct.classList.add('product_admin')
        }
        containerProduct.innerHTML =`
        <p>${element.title}</p>
        <p>$${element.price}</p>
        <p>Stock: ${element.stock = element.stock=== 0 ? 'Sin stock' : element.stock}</p>
        <p class="product-owner">${element.owner === "admin" ? 'Admin' : 'Usuario'}</p>
        <button class="${element.owner === userEmail ? 'openFormModal' : 'notModal'} " data-id="${element.id}">Modificar</button>
        <button class="${element.owner === userEmail ||userEmail==='admin' ? 'deleteActivate' : 'deleteDesactivate'}" id=${element.id}>Eliminar</button>`
        productsContainer.append(containerProduct)
        const buttonEliminar = document.getElementById(`${element.id}`)
        buttonEliminar.classList.add('btn_eliminar')
        buttonEliminar.addEventListener('click',async()=>{
            try {
                const response = await fetch(`/api/products/${element.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })   
                if(response.ok) {
                    const result = await response.json()
                    if(result.status !== "error"){
                        actualizarListaProductos(productsDB.filter(product => product.id !== element.id))
                    }
                } 
            } catch (error) {
                console.error('Error en la petición:', error)
            }
        })
        if(containerProduct.querySelector('.openFormModal')){
            const buttonModificar = containerProduct.querySelector('.openFormModal');
            buttonModificar.addEventListener('click', () => {
                const productId = buttonModificar.getAttribute('data-id');
                if(element.owner === userEmail){
                    Swal.fire({
                        title: 'Formulario',
                        html: `
                            <form class="form-actualizarProducto" id="formulario">
                                <label class="label-rtm" for="name">Ingrese el nombre del producto</label>
                                <input class="input-rtm" type="text" name="name" id="name" value='${element.title}' required>
                                <label class="label-rtm" for="description">Ingrese una descripción del producto</label>
                                <input class="input-rtm" type="text" name="description" id="description" value='${element.description}' required>
                                <label class="label-rtm" for="price">Ingrese el precio</label>
                                <input class="input-rtm" type="number" name="price" id="price" value='${element.price}' required>
                                <label class="label-rtm" for="thumbnail">Ingrese una imagen del producto (link)</label>
                                <input class="input-rtm" type="text" name="thumbnail" id="thumbnail" value='${element.thumbnail}' required>
                                <label class="label-rtm" for="code">Ingrese el código del producto</label>
                                <input class="input-rtm" type="text" name="code" id="code" value='${element.code}' required>
                                <label class="label-rtm" for="stock">Ingrese el stock del producto</label>
                                <input class="input-rtm" type="number" name="stock" id="stock" value='${element.stock}' required>
                                <label class="label-rtm" for="category">Ingrese la categoria del producto</label>
                                <input class="input-rtm" type="string" name="category" id="category" value='${element.category}' required>
                            </form>
                            `,
                        showCancelButton: true,
                        confirmButtonText: 'Enviar',
                        preConfirm: () => {
                            const title = Swal.getPopup().querySelector('#name').value;
                            const description = Swal.getPopup().querySelector('#description').value;
                            const price = Swal.getPopup().querySelector('#price').value;
                            const thumbnail = Swal.getPopup().querySelector('#thumbnail').value;
                            const code = Swal.getPopup().querySelector('#code').value;
                            const stock = Swal.getPopup().querySelector('#stock').value;
                            const category = Swal.getPopup().querySelector('#category').value;
                            const newProduct = {
                                title,
                                description,
                                price,
                                thumbnail,
                                code,
                                stock,
                                category   
                            }
                            if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                                Swal.showValidationMessage(`Por favor, complete todos los campos.`);
                            }
                            return newProduct;
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            fetch(`/api/products/${productId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(result.value)
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.status === 'success') {
                                    Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
                                    setTimeout(() => {
                                        window.location.href = '/realtimeproducts';
                                    },5000);
                                } else {
                                    Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
                                }
                            })
                            .catch(error => {
                                Swal.fire('Error', 'Ocurrió un error al actualizar el producto', 'error');
                            });
                        }
                    });
                }
            });
        }
    })
}
