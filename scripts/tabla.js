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
                view_resultados(result)
        }
    } catch (e) {
        console.error("Error: ", e);
    }
}

getValores()

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