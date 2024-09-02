const socket = io()

// document.addEventListener('DOMContentLoaded',()=>{
//     fetch('/api/users')
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Error al traer los usuarios');
//         }
//             return response.json();
//     })
//     .then(data => {
//         const users = data.message
//        actualizarUsuarios(users)
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// })


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
            Toastify({
                text: data.message,
                duration: 5000,
                newWindow: true,
                gravity: "top", 
                position: "right",
                style: {
                  background: "red",
                }
            }).showToast();
            socket.emit("nuevaLista")
            socket.on('listaActualizada',async(data)=>{
                const usersDB = data
                actualizarUsuarios(usersDB)
            })
        })
        .catch(error => {
            alert('Ocurrió un error al intentar eliminar usuarios inactivos.');
        });
    });

function actualizarUsuarios(users){
    const container = document.getElementById('card-container');
    container.innerHTML = ''
    users.forEach(user => {
        if(user.role !=='admin'){
            const card = document.createElement('div');
            card.className = 'card';
            if(user.role === 'premium'){
                card.className = 'card card-premium'
            }
            card.innerHTML = `
                <div class="card-title">${user.fullname || user.first_name + ' ' + user.last_name}</div>
                <p>Email: ${user.email}</p>
                <p>Rol: ${user.role}</p>
                <button class="change-role-btn" data-id="${user._id}">Cambiar el rol</button>
            `;
            container.appendChild(card);
        }
    })
    cambiarRol()
}

function cambiarRol(){
    document.querySelectorAll('.change-role-btn').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            // Lógica para cambiar el rol del usuario
            fetch(`/api/sessions/premium/${userId}`, {
                method: 'POST',
            })
            .then(response => response.json())
            .then(data => {
                socket.emit("nuevaLista")
                socket.on('listaActualizada',async(data)=>{
                    const usersDB = data
                    actualizarUsuarios(usersDB)
                })
            })
            .catch(error => {
                console.error('Error al cambiar el rol:', error);
            });
        });
    });
}

socket.on("listaUsuarios", data =>{
    const usersDB = data
    actualizarUsuarios(usersDB)
})