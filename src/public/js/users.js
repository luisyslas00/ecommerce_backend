document.addEventListener('DOMContentLoaded',()=>{
    fetch('/api/users')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al traer los usuarios');
        }
            return response.json();
    })
    .then(data => {
        const users = data.message
        const container = document.getElementById('card-container');
        users.forEach(user => {
            if(user.role !=='admin'){
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="card-title">${user.fullname || user.first_name + ' ' + user.last_name}</div>
                    <p>Email: ${user.email}</p>
                    <p>Rol: ${user.role}</p>
                    <button class="change-role-btn" data-id="${user._id}">Cambiar el rol</button>
                `;
                container.appendChild(card);
            }
        })
        // Event listener para cambiar el rol
        document.querySelectorAll('.change-role-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                console.log('Hiciste click',userId)
                // Lógica para cambiar el rol del usuario
                fetch(`/api/sessions/premium/${userId}`, {
                    method: 'POST',
                })
                .then(response => response.json())
                .then(data => {
                    console.log(`Rol cambiado para el usuario con ID: ${userId}`);
                    // Actualizar la vista o dar feedback al usuario
                })
                .catch(error => {
                    console.error('Error al cambiar el rol:', error);
                });
            });
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
})


const eliminarButton = document.getElementById('btn-eliminar');
    eliminarButton.addEventListener('click', () => {
        fetch('/api/users', {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar usuarios inactivos');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message); // Muestra un mensaje de confirmación al usuario
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al intentar eliminar usuarios inactivos.');
        });
    });