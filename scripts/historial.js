


/////////////////////////Valores al inicio////////////////////
let container_registros = document.getElementById("container_registros")

function toDateTime(fecha, hora) {
    const [day, month, year] = fecha.split('-').map(Number);
    const [hours, minutes] = hora.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes); // Mes - 1 porque es 0-indexado
}


/////////////////////////Borrar registro////////////////////
function view_resultados(array) {
    // Ordenar por fecha y hora
    array.sort((a, b) => {
        const dateA = toDateTime(a.fechaString, a.hora);
        const dateB = toDateTime(b.fechaString, b.hora);
        return dateB - dateA; // Ordenar de más reciente a más antiguo
    });

    for (let i in array) {
        container_registros.innerHTML += ` <tr class=${color_row(array[i].valor)}>
            <td>${array[i].fechaString}</td>
             <td>${array[i].hora}</td>
              <td>${array[i].valor}</td>
               <td>${array[i].momento==="Pre Desayuno"?"Ayunas":array[i].momento}</td>
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

async function deleteRegistro(id) {

    try {
        let token = localStorage.getItem("token")
        const response = await fetch(`https://backend-glucemia.vercel.app/borrar_Registro/${id}`, {
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


function color_row(valor){
    if (valor > 180 ){
        return("table-danger")
    } else if (valor < 70) {
return ("table-primary") 
} else {
        return("table-success")
    }

}


let checkAlto = document.getElementById("checkAlto")
let checkBajo = document.getElementById("checkBajo")
let checkNormal = document.getElementById("checkNormal")
let checkTodos = document.getElementById("todos")

let arrayResultados =[]

document.addEventListener("DOMContentLoaded",()=>{
checkAlto.addEventListener("click",()=>{ 
        let arrayAlto = []
        container_registros.innerHTML =``
        
        for (let i=0; i<arrayResultados[0].length ; i++){
            if (arrayResultados[0][i].valor > 180) {
                arrayAlto.push(arrayResultados[0][i])
            }
        }
        view_resultados(arrayAlto)
    })


    checkBajo.addEventListener("click",()=>{ 
        let arrayBajo = []
        container_registros.innerHTML =``
        
        for (let i=0; i<arrayResultados[0].length ; i++){
            if (arrayResultados[0][i].valor < 70) {
                arrayBajo.push(arrayResultados[0][i])
            }
        }
        view_resultados(arrayBajo)
    })

    checkNormal.addEventListener("click",()=>{ 
        let arrayNormal = []
        container_registros.innerHTML =``
        
        for (let i=0; i<arrayResultados[0].length ; i++){
            if (arrayResultados[0][i].valor >= 70 && arrayResultados[0][i].valor <= 180  ) {
                arrayNormal.push(arrayResultados[0][i])
            }
        }
        view_resultados(arrayNormal)
    })

    checkTodos.addEventListener("click",()=>{ 
        let arrayTodos = []
        container_registros.innerHTML =``
for (let i=0; i<arrayResultados[0].length ; i++){
arrayTodos.push(arrayResultados[0][i])
            }
        view_resultados(arrayTodos)
    })
})

async function getValores(page,limit) {
    try {
        let token = localStorage.getItem("token")
        const userId = localStorage.getItem('id')
        const response = await fetch(`https://backend-glucemia.vercel.app/pages?userId=${userId}&page=${page}&limit=${limit}`, 
            {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })


        if (response.ok) {
            
            const result = await response.json()
            console.log(result.registros)
            return result
        }
    }
    catch (e) {
        console.error("Error: ", e)
    }

}

let currentPage = 1
const limit = 15

async function loadPage(page) {
   const data = await getValores(page, limit)
   if (data){
            currentPage = page
            arrayResultados.push(data.registros)
            console.log(arrayResultados[0][2].valor)
            container_registros.innerHTML =""
            view_resultados(data.registros)
} else {
    alert("Última página")
}
}


function nextPage(){
    loadPage(currentPage + 1)
}

function previousPage(){
    if(currentPage>1){
        loadPage(currentPage - 1)
    }
}

loadPage(currentPage)

document.getElementById("anterior").addEventListener("click", ()=>{
    previousPage()
})

document.getElementById("siguiente").addEventListener("click", ()=>{
    nextPage()
})

let btn_close = document.getElementById("close")

btn_close.addEventListener("click", () => {
    localStorage.clear()
    location.reload()
})