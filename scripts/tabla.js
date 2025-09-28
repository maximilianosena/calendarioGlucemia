let valores = []

async function getValores() {
    try {
        let token = localStorage.getItem("token")
        const userId = localStorage.getItem('id')
        const response = await fetch(`https://backend-glucemia.vercel.app/all?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.ok) {
            const result = await response.json();
           
                console.log("valores: ", result)
                valores.push(result)
                view_resultados(result)
        }
    } catch (e) {
        console.error("Error: ", e);
    }
}

getValores()

let btn_close = document.getElementById("close")

btn_close.addEventListener("click", () => {
    localStorage.clear()
    location.reload()
})


function toDateTime(fecha, hora) {
    const [day, month, year] = fecha.split('-').map(Number);
    const [hours, minutes] = hora.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes); // Mes - 1 porque es 0-indexado
}

function view_resultados(array) {
    
  // Objeto para agrupar registros por fecha
let registrosPorFecha = {};

// Agrupar los datos por fecha
array.forEach(item => {
    if (!registrosPorFecha[item.fechaString]) {
        registrosPorFecha[item.fechaString] = {
            "Ayunas": "---",
            "Pre Desayuno": "---",
            "Post Desayuno": "---",
            "Pre Almuerzo": "---",
            "Post Almuerzo": "---",
            "Pre Merienda": "---",
            "Post Merienda": "---",
            "Pre Cena": "---",
            "Post Cena": "---"
        };
    }
    registrosPorFecha[item.fechaString][item.momento] = item.valor; 
});


let fechasOrdenadas = Object.keys(registrosPorFecha).sort((a, b) => new Date(a) - new Date(b));

fechasOrdenadas.sort((a, b) => {
    let fechaA = a.split("-").reverse().join("-"); 
    let fechaB = b.split("-").reverse().join("-"); 
    return new Date(fechaB) - new Date(fechaA) ;
});

let html = "";
fechasOrdenadas.forEach(fecha => {
    let fila = registrosPorFecha[fecha];
    html += `
        <tr style="text-align: center;">
            <td>${array.fechaString}</td>
            <td>${fila["Ayunas"]}</td>
            <td>${fila["Pre Desayuno"]}</td>
            <td>${fila["Post Desayuno"]}</td>
            <td>${fila["Pre Almuerzo"]}</td>
            <td>${fila["Post Almuerzo"]}</td>
            <td>${fila["Pre Merienda"]}</td>
            <td>${fila["Post Merienda"]}</td>
            <td>${fila["Pre Cena"]}</td>
            <td>${fila["Post Cena"]}</td>
        </tr>
    `;
});

// Insertar en la tabla
container_registros.innerHTML = html;

}



let desde = document.getElementById("desde");
let hasta = document.getElementById("hasta");

desde.addEventListener("change",() =>{

    console.log(desde.value)

    localStorage.setItem("desde", desde.value)
}

)

hasta.addEventListener("change",() =>{

    console.log(hasta.value)
    localStorage.setItem("hasta", hasta.value)
}

)

let valorDesde = localStorage.getItem("desde") || "0";
let valorHasta = localStorage.getItem("hasta") || "0";
let filtro = [];
let btn_filtro = document.getElementById("fecha_filtro")
let btn_reset = document.getElementById("fecha_resta")
console.log(valores)

btn_filtro.addEventListener("click", () => {

    console.log("Array valores:", valores);

    let valorDesde = localStorage.getItem("desde");
    let valorHasta = localStorage.getItem("hasta");

    if (!valorDesde || !valorHasta) {
        console.error("Error: No hay fechas seleccionadas.");
        return;
    }

    let fechaInicio = new Date(valorDesde);
    let fechaFin = new Date(valorHasta);
    fechaInicio.setDate(fechaInicio.getDate() + 1);
    fechaFin.setDate(fechaFin.getDate() + 1);
    fechaInicio.setHours(0, 0, 0, 0);
    fechaFin.setHours(23, 59, 59, 999);
    console.log("Fecha Desde (JS):", fechaInicio);
    console.log("Fecha Hasta (JS):", fechaFin);

    let filtro = [];
    let arrayValores = valores[0]
    for (let i = 0; i < arrayValores.length; i++) {
        let item = arrayValores[i];

        if (!item || !item.fecha) {
            console.warn(`Advertencia: El elemento en índice ${i} no tiene fecha válida.`);
            continue;
        }

        let fechaActual = new Date(item.fecha); // Convertimos la fecha del JSON

        if (fechaActual >= fechaInicio && fechaActual <= fechaFin) {
            filtro.push(item);
        }
    }

    console.log("Resultados filtrados:", filtro);
    view_resultados(filtro)
});

btn_reset.addEventListener("click", () => {

    view_resultados(valores[0][0])
})





