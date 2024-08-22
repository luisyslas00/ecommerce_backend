document.getElementById('formulario').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    const form = document.getElementById('formulario');
    const formData = new FormData(form); // Crea un FormData con los datos del formulario
    const uid = form.getAttribute('data-id')
    try {
        const response = await fetch(`/api/sessions/premium/${uid}`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            if (result.status === "success") {
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
            // Aquí puedes manejar la respuesta exitosa
        } else {
            console.error('Error en la respuesta:', response.statusText);
            // Aquí puedes manejar el error en la respuesta
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        // Aquí puedes manejar cualquier error que ocurra durante el fetch
    }
});