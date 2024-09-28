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
            const result = await response.json()
            console.log(result)
            separarMes(result)

        }
    }
    catch (e) {
        console.error("Error: ", e)
    }

}
getValores()

function separarMes(variable) {
    let promedio = [
        { nombre: "Enero", valor: [], dia: [] },
        { nombre: "Febrero", valor: [], dia: [] },
        { nombre: "Marzo", valor: [], dia: [] },
        { nombre: "Abril", valor: [], dia: [] },
        { nombre: "Mayo", valor: [], dia: [] },
        { nombre: "Junio", valor: [], dia: [] },
        { nombre: "Julio", valor: [], dia: [] },
        { nombre: "Agosto", valor: [], dia: [] },
        { nombre: "Septiembre", valor: [], dia: [] },
        { nombre: "Octubre", valor: [], dia: [] },
        { nombre: "Noviembre", valor: [], dia: [] },
        { nombre: "Diciembre", valor: [], dia: [] }
    ];

    for (let i = 0; i < variable.length; i++) {
        let fecha_split = variable[i].fechaString.split("-");
        console.log("Fecha original:", variable[i].fechaString); // Muestra la fecha original
        console.log("Fecha dividida:", fecha_split); // Muestra el resultado de la división

        let mes = fecha_split[1];
        let mesIndex = parseInt(mes, 10) - 1; // Convertir el mes a un índice (0 = enero, 1 = febrero, ..., 8 = septiembre, etc.)

        // Agregar valores al promedio según el mes
        if (mesIndex >= 0 && mesIndex < 12) {
            promedio[mesIndex].valor.push(variable[i].valor);
            promedio[mesIndex].dia.push(variable[i].fechaString);
        }
    }

    let mesActual = new Date().getMonth();

    // Crea un nuevo array para los últimos 3 meses
    let ultimosTresMeses = [];

    // Añade los últimos 3 meses, teniendo en cuenta el índice
    for (let i = 0; i < 3; i++) {
        // Usar el operador módulo para manejar el ciclo de meses
        let mesIndex = (mesActual - i + 12) % 12;
        ultimosTresMeses.push(promedio[mesIndex]);
    }

    console.log(ultimosTresMeses);

    // Calcula el índice del último mes
    let mesIndex = (mesActual + 12) % 12;

    // Obtén el último mes
    let ultimoMes = promedio[mesIndex];

    console.log(ultimoMes);
    promedioValores(ultimoMes)
    promedio_En_Unidades(ultimoMes)
    hemoglobina(ultimosTresMeses)
    return promedio; // Devuelve el array de promedio
}

let rango = document.getElementById("tiempoRango")

function promedioValores(dato) {
    let arriba = []
    let abajo = []
    let normal = []
    for (let i = 0; i < dato.valor.length; i++) {
        console.log(dato.valor[i])
        if (dato.valor[i] > 180) {
            arriba.push(dato.valor[i])
        } else if (dato.valor[i] < 70) {
            abajo.push(dato.valor[i])
        } else {
            normal.push(dato.valor[i])
        }
    }
    let valorPromedioAlto = ((arriba.length / dato.valor.length) * 100).toFixed(2)
    let valorPromedioBajo = (abajo.length / dato.valor.length * 100).toFixed(2)
    let valorPromedioNormal = (normal.length / dato.valor.length * 100).toFixed(2)

    rango.innerHTML += `<h6>En el mes de ${dato.nombre}:</h6><br><p>${!isNaN(valorPromedioNormal) ? valorPromedioNormal : 0}% en Rango</p> <p> ${!isNaN(valorPromedioAlto) ? valorPromedioAlto : 0}% por encima del Rango</p> <p>${!isNaN(valorPromedioBajo) ? valorPromedioBajo : 0}% por debajo del rango</p> <br> `
}

let glu_promedio = document.getElementById("promedio")

function promedio_En_Unidades(dato) {
    let total = 0
    for (let i = 0; i < dato.valor.length; i++) {
        total += dato.valor[i]
    }

    glu_promedio.innerHTML += `<h6>La Glucosa promedio es de ${total > 0 ? total : 0} (mg/dL)<h6> <br>`
}

let hemoglobina_glicosilada = document.getElementById("glicosilada")

function hemoglobina(año) {
    let trimestre = 0
    let valores = 0
    let cantidad = 0
    for (let i = 0; i < año.length; i++) {
        console.log(año[i].nombre)
        console.log(año[i].valor)
        if (año[i].valor.length > 0 && trimestre < 4) {
            for (let a = 0; a < año[i].valor.length; a++) {
                console.log(año[i].valor[a])
                valores += año[i].valor[a]
            }
            cantidad += año[i].valor.length
            trimestre += 1
        }
        console.log(valores)
        console.log(cantidad)
    }

    let result_hemoglobina = cantidad > 0 ? (((valores / cantidad) + 46.7) / 28.7) : 0
    let final = result_hemoglobina.toFixed(2)
    hemoglobina_glicosilada.innerHTML += `<h6>La hemoglobina Glicosilada es de ${result_hemoglobina > 0 ? final : 0}%<h6> <br>
   <figure> <figcaption class="blockquote-footer"><p>Este dato tomará fiabilidad al recibir datos de al menos los últimos 2 o 3 meses.<p></figcaption> </figure>
    `
}