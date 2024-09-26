async function getValores() {
    try {
        let token = localStorage.getItem("token")
        const response = await fetch(`https://backend-glucemia.vercel.app/all`, {
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

    
    promedioValores(promedio[8])
    return promedio; // Devuelve el array de promedio
}

let rango = document.getElementById("tiempoRango")

function promedioValores (dato){
    let arriba = []
    let abajo = []
    let normal =[]
    for (let i=0; i<dato.valor.length; i++){
        console.log(dato.valor[i])
       if (dato.valor[i]>1.7){
        arriba.push(dato.valor[i])
       } else if (dato.valor[i]<0.7){
        abajo.push(dato.valor[i])
       } else {
        normal.push(dato.valor[i])
       }
    }
    let valorPromedioAlto = ((arriba.length/dato.valor.length)*100).toFixed(2)
    let valorPromedioBajo = (abajo.length/dato.valor.length*100).toFixed(2)
    let valorPromedioNormal = (normal.length/dato.valor.length*100).toFixed(2)

    rango.innerHTML+=`<h6>En el mes de ${dato.nombre}:</h6><br><p>${!isNaN(valorPromedioNormal)?valorPromedioNormal:0}% en Rango</p> <p> ${!isNaN(valorPromedioAlto)?valorPromedioAlto:0}% por encima del Rango</p> <p>${!isNaN(valorPromedioBajo)?valorPromedioBajo:0}% por debajo del rango</p> <br> `
}

