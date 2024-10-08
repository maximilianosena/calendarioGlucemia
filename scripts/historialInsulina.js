
/////////////////////////Valores al inicio////////////////////
let container_registros = document.getElementById("container_insulina")

async function getValores() {
    try {
        let token = localStorage.getItem("token")
        const userId = localStorage.getItem('id')
        const response = await fetch(`https://backend-glucemia.vercel.app/insulina?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })


        if (response.ok) {
            const result = await response.json()
            console.log(result)
            view_resultados(result)
        }
    }
    catch (e) {
        console.error("Error: ", e)
    }

}
getValores()

function toDateTime(fecha, hora) {
    const [day, month, year] = fecha.split('-').map(Number);
    const [hours, minutes] = hora.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes); // Mes - 1 porque es 0-indexado
}



function view_resultados(array) {
  // Ordenar por fecha y hora
array.sort((a, b) => {
    const dateA = toDateTime(a.fechaString, a.hora);
    const dateB = toDateTime(b.fechaString, b.hora);
    return dateB - dateA; // Ordenar de más reciente a más antiguo
});

    for (let i in array) {
        container_registros.innerHTML += ` <tr>
            <td>${array[i].fechaString}</td>
             <td>${array[i].hora}</td>
              <td>${array[i].unidades}</td>
              <td>${array[i].tipo}</td>
               <td>${array[i].momento}</td>
                <td>${array[i].notas}</td>
                 <td><button id=${array[i].id} name="borrar">X</button></td>         
        </tr>`
    }
    
    container_registros.addEventListener('click', (event) => {
        if (event.target.name === 'borrar') {  
            const id = event.target.id;  // Obtenemos el id del botón
            console.log("Hago click en id: ", id);
            
           deleteRegistro(id);
        }
    });

}
/////////////////////////Borrar registro////////////////////
async function deleteRegistro(id) {

    try {
        let token = localStorage.getItem("token")
        const response = await fetch(`https://backend-glucemia.vercel.app/borrar_Insulina/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Respuesta del servidor:', result);
            setTimeout(() => {
                location.reload()
            }, 1000)
        } else {
            console.error('Error en la solicitud:', response.status);
        }
    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
    }


}