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