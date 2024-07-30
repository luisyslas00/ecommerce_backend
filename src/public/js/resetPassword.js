document.getElementById('formulario').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    const formData = new FormData(event.target);
    const data = {
        email: formData.get('email'),
    };
    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = ''; 
    if (!data.email) {
        responseDiv.textContent = 'Error: Completar todos los datos';
        responseDiv.style.color = 'red';
        return;
    }
    try {
        const response = await fetch('/api/sessions/resetpassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.status === "success") {
            responseDiv.textContent = 'Correo de recuperación enviado!';
            responseDiv.style.color = 'green';
            return;
        }else{
            responseDiv.textContent = 'Correo no encontrado'; // Mostrar el mensaje de error devuelto desde el backend
            responseDiv.style.color = 'red';
        }
    }catch (error) {
        console.error('Error:', error);
        responseDiv.textContent = 'Ocurrió un error';
        responseDiv.style.color = 'red';
    }
});