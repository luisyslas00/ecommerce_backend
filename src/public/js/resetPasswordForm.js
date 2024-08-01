document.getElementById('formulario').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    const formData = new FormData(event.target);
    const btnId = document.getElementById('btnEnviar')
    const token = btnId.getAttribute('data-id')
    const data = {
        password: formData.get('password'),
        newPassword: formData.get('newPassword'),
    };
    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = ''; 
    if (!data.password||!data.newPassword) {
        responseDiv.textContent = 'Error: Completar todos los datos';
        responseDiv.style.color = 'red';
        return;
    }
    try {
        const response = await fetch(`/api/sessions/resetpassword/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.status === "success") {
            responseDiv.textContent = result.message;
            responseDiv.style.color = 'green';
            return;
        }else{
            responseDiv.textContent = result.message;
            responseDiv.style.color = 'red';
        }
    }catch (error) {
        console.error('Error:', error);
        responseDiv.textContent = 'Ocurrió un error';
        responseDiv.style.color = 'red';
    }
});