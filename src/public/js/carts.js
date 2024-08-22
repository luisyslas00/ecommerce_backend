document.addEventListener('DOMContentLoaded', ()=>{
    const buttons = document.querySelectorAll('.button_add_product')
    const btnCart = document.getElementById('btn_cart')
    const cartId = btnCart.getAttribute('data-id')
    if(cartId){
        buttons.forEach(button => {
            button.addEventListener('click', async () => {
                const productId = button.getAttribute('id');
                try {
                    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const result = await response.json();
                    console.log(result)
                    if (result.status === "success") {
                        alert('Producto agregado al carrito');
                    } else {
                        alert('Error al agregar el producto al carrito');
                    }
                } catch (error) {
                    console.error('Error caught:', error);
                    alert('Ocurrió un error al agregar el producto al carrito');
                }
            });
        });
    }else{
        buttons.forEach(button => {
            button.addEventListener('click', async () => {
                alert("Debes iniciar sesión")
            })
        })
    }
});
