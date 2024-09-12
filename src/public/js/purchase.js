document.addEventListener('DOMContentLoaded', () => {
    const purchaseButton = document.getElementById('btn_purchase')
    if(purchaseButton){
        const cartID = purchaseButton.getAttribute('data-id')
        purchaseButton.addEventListener('click', async () => {
            try {
                const response = await fetch(`/api/carts/${cartID}/purchase`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const result = await response.json();
                    if (response.ok) {
                        // Construir listas de productos comprados y no comprados
                        const products = result.ticket.products
                        const productsPurchased = []
                        const productsNotPurchased = []
                        for (const element of products) {
                            productsPurchased.push({title:element.product.title,price:element.product.price,quantity:element.quantity})
                        }
                        const purchasedList = productsPurchased.map(item => 
                            `<li>${item.title} - $${item.price} (Cantidad: ${item.quantity})</li>`
                        ).join('');
                        if(result.productsNotPurchased!==0){
                            const productsNot = result.productsNotPurchased
                            for (const element of productsNot) {
                                productsNotPurchased.push({title:element.product.title,price:element.product.price,quantity:element.quantity})
                            }
                        }
                        const notPurchasedList = productsNotPurchased.map(item => 
                            `<li>${item.title} - $${item.price} (Cantidad: ${item.quantity})</li>`
                        ).join('');

                        // Mostrar el modal de SweetAlert con los productos comprados y no comprados
                        Swal.fire({
                            title: 'Compra completada',
                            html: `
                                <div class="swal__content">
                                    <h3 class="swal__subtitle">Productos comprados:</h3>
                                    <ul class="swal__list swal__purchased-list">${purchasedList}</ul>
                                    <h3 class="swal__subtitle">Los siguientes productos superan el stock disponible:</h3>
                                    <ul class="swal__list swal__not-purchased-list">${notPurchasedList}</ul>
                                    <p class="swal__total">Total de la compra: <strong>$${result.ticket.amount}</strong></p>
                                </div>
                            `,
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            customClass: {
                                popup: 'swal__popup',
                                title: 'swal__title',
                                confirmButton: 'swal__confirm-btn',
                            }
                        }).then((result) => {
                            if (result.isConfirmed){
                                location.reload()
                            }});
                    } else {
                        Toastify({
                            text: 'Error al completar la compra - PRODUCTOS DEL CARRITO SUPERAN EL STOCK DISPONIBLE!',
                            duration: 3000,
                            newWindow: true,
                            gravity: "top", 
                            position: "right",
                            style: {
                              background: "red",
                            }
                        }).showToast();
                        setTimeout(() => {
                            location.reload();
                        }, 3000);
                    }
                } else {
                    console.error('Respuesta no es JSON:', await response.text());
                }
            } catch (error) {
                    console.error('Error de red al completar la compra:', error);
                    Toastify({
                        text: 'Error al completar la compra - PRODUCTOS DEL CARRITO SUPERAN EL STOCK DISPONIBLE!',
                        duration: 3000,
                        newWindow: true,
                        gravity: "top", 
                        position: "right",
                        style: {
                          background: "red",
                        }
                    }).showToast();
                    setTimeout(() => {
                        location.reload();
                    }, 3000);
            }
        })
    }
})

if(document.getElementById('btn_empty_cart')){
    document.getElementById('btn_empty_cart').addEventListener('click', async function() {
        const cartID = this.getAttribute('data-id');
        
        const response = await fetch(`/api/carts/${cartID}`, {
            method: 'DELETE'
        });
    
        const result = await response.json();
        if (result.status === 'success') {
            Toastify({
                text: 'Carrito vaciado!',
                duration: 1000,
                newWindow: true,
                gravity: "top", 
                position: "right",
                style: {
                  background: "green",
                }
            }).showToast();
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            Toastify({
                text: 'Error al vaciar el carrito!',
                duration: 1000,
                newWindow: true,
                gravity: "top", 
                position: "right",
                style: {
                  background: "red",
                }
            }).showToast();;
        }
    });
}

if(document.querySelectorAll('.btn_remove')){
    document.querySelectorAll('.btn_remove').forEach(button => {
        button.addEventListener('click', async function() {
            const productId = this.getAttribute('data-id');
            const btnId = document.getElementById('btn_purchase')
            const cartId = btnId.getAttribute('data-id')
    
            const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'DELETE'
            });
    
            const result = await response.json();
            if (result.status === 'success') {
                Toastify({
                    text: 'Producto eliminado del carrito!',
                    duration: 1000,
                    newWindow: true,
                    gravity: "top", 
                    position: "right",
                    style: {
                      background: "green",
                    }
                }).showToast();
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                Toastify({
                    text: 'Error al eliminar el producto!',
                    duration: 1000,
                    newWindow: true,
                    gravity: "top", 
                    position: "right",
                    style: {
                      background: "red",
                    }
                }).showToast();;
            }
        });
    });
}