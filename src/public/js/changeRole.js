let form

if(document.getElementById('formulario')){
    form = document.getElementById('formulario')
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const userId = form.getAttribute('data-id');
        try {
            const response = await fetch(`/api/sessions/${userId}/documents`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (response.ok) {
                Toastify({
                    text: 'Documento subido!',
                    duration: 5000,
                    newWindow: true,
                    gravity: "top", 
                    position: "right",
                    style: {
                      background: "green",
                    }
                }).showToast();
                const response = await fetch(`/api/sessions/premium/${userId}`, {
                                method: 'POST',
                                body: formData
                            });
                if (response.ok) {
                    const result = await response.json();
                    if (result.status === "success") {
                        setTimeout(() => {
                            window.location.href = '/profile';
                        }, 1000);
                    }
                } else {
                    console.error('Error en la respuesta:', response.statusText);
                }
            } else {
                Toastify({
                    text: 'Error al subir los archivos',
                    duration: 1000,
                    newWindow: true,
                    gravity: "top", 
                    position: "right",
                    style: {
                      background: "red",
                    }
                }).showToast();
            }
        } catch (error) {
            Toastify({
                text: 'Error al subir los archivos',
                duration: 1000,
                newWindow: true,
                gravity: "top", 
                position: "right",
                style: {
                  background: "red",
                }
            }).showToast();
            console.error('Error:', error);
        }
    });
}
if(document.getElementById('formulario-baja')){
    form = document.getElementById('formulario-baja');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const userId = form.getAttribute('data-id');
        try {
            const response = await fetch(`/api/sessions/premium/${userId}`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const result = await response.json();
                if (result.status === "success") {
                    setTimeout(() => {
                        window.location.href = '/profile';
                    }, 1000);
                }
            } else {
                console.error('Error en la respuesta:', response.statusText);
            }
        } catch (error) {
            Toastify({
                text: 'Error al subir los archivos',
                duration: 1000,
                newWindow: true,
                gravity: "top", 
                position: "right",
                style: {
                  background: "red",
                }
            }).showToast();
            console.error('Error:', error);
        }
    });
}

if(document.getElementById('formulario_profile')){
    const formulario = document.getElementById('formulario_profile')
    formulario.addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(formulario);
        const userId = formulario.getAttribute('data-id');
        try {
            const response = await fetch(`/api/sessions/${userId}/documents`, {
                method: 'POST',
                body: formData
            });
    
            const result = await response.json();
            if (response.ok) {
                Toastify({
                    text: 'Foto actualizada!',
                    duration: 5000,
                    newWindow: true,
                    gravity: "top", 
                    position: "right",
                    style: {
                      background: "green",
                    }
                }).showToast();
                setTimeout(() => {
                    window.location.href = '/profile';
                }, 2000);
            } else {
                Toastify({
                    text: 'Error al subir los archivos',
                    duration: 1000,
                    newWindow: true,
                    gravity: "top", 
                    position: "right",
                    style: {
                      background: "red",
                    }
                }).showToast();
            }
        } catch (error) {
            Toastify({
                text: 'Error al subir los archivos',
                duration: 1000,
                newWindow: true,
                gravity: "top", 
                position: "right",
                style: {
                  background: "red",
                }
            }).showToast();
            console.error('Error:', error);
        }
    });
}