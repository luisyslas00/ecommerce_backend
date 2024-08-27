// document.getElementById('formulario').addEventListener('submit', async function(event) {
//     event.preventDefault(); // Evita el envío del formulario por defecto

//     const form = document.getElementById('formulario');
//     const formData = new FormData(form); // Crea un FormData con los datos del formulario
//     const uid = form.getAttribute('data-id')
//     try {
//         const response = await fetch(`/api/sessions/premium/${uid}`, {
//             method: 'POST',
//             body: formData
//         });

//         if (response.ok) {
//             const result = await response.json();
//             if (result.status === "success") {
//                 setTimeout(() => {
//                     window.location.href = '/';
//                 }, 1000);
//             }
//             // Aquí puedes manejar la respuesta exitosa
//         } else {
//             console.error('Error en la respuesta:', response.statusText);
//             // Aquí puedes manejar el error en la respuesta
//         }
//     } catch (error) {
//         console.error('Error en la solicitud:', error);
//         // Aquí puedes manejar cualquier error que ocurra durante el fetch
//     }
// });

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
            console.log(result)
            if (response.ok) {
                alert('Documents uploaded successfully');
                const response = await fetch(`/api/sessions/premium/${userId}`, {
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
                // Puedes agregar lógica para manejar una respuesta exitosa
            } else {
                alert(`Failed to upload documents: ${result.message}`);
                // Puedes manejar errores aquí
            }
        } catch (error) {
            alert('Error uploading documents');
            console.error('Error:', error);
        }
    });
}else{
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
                window.location.href = '/';
            }, 1000);
            }
            // Aquí puedes manejar la respuesta exitosa
            } else {
            console.error('Error en la respuesta:', response.statusText);
            // Aquí puedes manejar el error en la respuesta
            }
        } catch (error) {
            alert('Error uploading documents');
            console.error('Error:', error);
        }
    });
}
