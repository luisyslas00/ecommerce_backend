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
                        alert('Compra completada con éxito')
                        setTimeout(() => {
                            window.location.href = '/products';
                        }, 1000);
                    } else {
                        console.error('Error al completar la compra:', result);
                        alert('Error al completar la compra');
                    }
                } else {
                    console.error('Respuesta no es JSON:', await response.text());
                    alert('Error: La respuesta no es JSON');
                }
            } catch (error) {
                    console.error('Error de red al completar la compra:', error);
                    alert('Error de red al completar la compra');
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
            alert('Carrito vaciado');
            location.reload(); // Recargar la página para reflejar los cambios
        } else {
            alert('Error al vaciar el carrito');
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
                alert('Producto eliminado del carrito');
                location.reload();  // Recargar la página para reflejar los cambios
            } else {
                alert('Error al eliminar el producto');
            }
        });
    });
}