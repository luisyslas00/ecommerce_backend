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
                    if (result.status === "success") {
                        Toastify({
                            text: 'Producto agregado al carrito!',
                            duration: 5000,
                            newWindow: true,
                            gravity: "top", 
                            position: "right",
                            style: {
                              background: "green",
                            }
                        }).showToast();
                    } else {
                        Toastify({
                            text: 'Error al agregar el producto',
                            duration: 5000,
                            newWindow: true,
                            gravity: "top", 
                            position: "right",
                            style: {
                              background: "red",
                            }
                        }).showToast();
                    }
                } catch (error) {
                    console.error('Error caught:', error);
                    Toastify({
                        text: 'No puedes agregar productos propios',
                        duration: 5000,
                        newWindow: true,
                        gravity: "top", 
                        position: "right",
                        style: {
                          background: "red",
                        }
                    }).showToast();
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
