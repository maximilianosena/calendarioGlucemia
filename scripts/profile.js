/////backend-glucemia.vercel.app



async function getValores() {
    try {
        let token = localStorage.getItem("token")
        const email = localStorage.getItem('user')
        const response = await fetch(`https://backend-glucemia.vercel.app/perfil?email=${email}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })


        if (response.ok) {
            const result = await response.json()
            console.log(result)
            showPerfil(result)

        }
    }
    catch (e) {
        console.error("Error: ", e)
    }

}
getValores()



async function showPerfil(datos){
    let nombre = document.getElementById("nombre")
    let email = document.getElementById("email")

    
        nombre.innerHTML += `<span><strong> Nombre del Usuario: </strong>${datos.alias} </span>`;
        email.innerHTML += `<span> <strong>Email registrado: </strong> ${datos.email} </span>`;
   
    
}

async function borrarCuenta() {
  let token = localStorage.getItem("token");
  const userId = localStorage.getItem('id');

  if (!token || !userId) {
      alert('Token o userId no encontrados.');
      return;
  } 
  console.log(token)
    fetch(`https://backend-glucemia.vercel.app/borrar_Perfil`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {  // Verifica si la respuesta es OK
          return response.json().then(data => {
            throw new Error(data.error || 'Error al eliminar la cuenta');
          });
        }
        return response.json();
      })
      .then(data => {
        if (data.mensaje) {
          console.log(data.mensaje);
          alert("Cuenta eliminada");
          setTimeout(() => {
        localStorage.clear();
        location.reload();
      }, 2000); 
        }
      })
      .catch(error => {
        alert(error.message); // Muestra el mensaje de error
        console.error('Error:', error);
      });
}


const myToast = new bootstrap.Toast(document.getElementById('myToast'));

document.getElementById("btn_toast").addEventListener("click", () => {
    myToast.show();
    
    document.getElementById('precaucion').addEventListener('click', function () {
        const btn_borrar = document.getElementById('btn_borrar');

        if (btn_borrar) {
            btn_borrar.addEventListener('click', function () {
                borrarCuenta();
            });
        }
    });
});





