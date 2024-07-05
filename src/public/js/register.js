document.getElementById('formulario').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        age: formData.get('age'),
        email: formData.get('email'),
        password: formData.get('password')
    };
    try {
        const response = await fetch('/api/sessions/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        const responseDiv = document.getElementById('response');
        if (result.status === 'success') {
            responseDiv.textContent = 'Usuario registrado correctamente';
            responseDiv.style.color = 'green';
            document.getElementById('formulario').reset()
        } else {
            responseDiv.textContent = `${result.message}`;
            responseDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        const responseDiv = document.getElementById('response');
        responseDiv.textContent = 'Ocurrió un error durante el registro';
        responseDiv.style.color = 'red';
    }
});