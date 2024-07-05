document.getElementById('formulario').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    const formData = new FormData(event.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = ''; 
    if (!data.email || !data.password) {
        responseDiv.textContent = 'Error: Completar todos los datos';
        responseDiv.style.color = 'red';
        return;
    }
    try {
        const response = await fetch('/api/sessions/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.status === "success") {
            setTimeout(() => {
                window.location.href = '/products';
            }, 1000);
        }else{
            responseDiv.textContent = result.message; // Mostrar el mensaje de error devuelto desde el backend
            responseDiv.style.color = 'red';
        }
    }catch (error) {
        console.error('Error:', error);
        responseDiv.textContent = 'Ocurrió un error durante el inicio de sesión';
        responseDiv.style.color = 'red';
    }
});