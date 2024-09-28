const ctx = document.getElementById('myChart').getContext('2d');
let myChart; 

let meses =  [
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
]



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
            recorrer_meses(result)
            get_mes(result)
        }
    }
    catch (e) {
        console.error("Error: ", e)
    }

}
getValores()
///////////////////////SELECCIONAR MES/////////////////////////
let seleccionadorMes = document.getElementById("seleccionMes")

for (let i = 0; i < seleccionadorMes.options.length; i++){
    console.log(seleccionadorMes.options[i].value)
}





function tipo_grafica1(mes){

    let showMes = meses.find(e => e.nombre === mes)
    console.log(showMes)
    
    let arrayLabels =[]
    showMes.dia.forEach(element => {
        arrayLabels.push(element)
    })
    
    let arrayData = []
    showMes.valor.forEach(element => {
        arrayData.push(element)
    })
    
    myChart = new Chart(ctx, {
        type: 'line', // Tipo de gráfico: bar, line, pie, etc.
        data: {
            labels: arrayLabels, // Etiquetas en el eje X
            datasets: [{
                label: 'Variables mg/dL',
                data: arrayData, // Datos de cada barra
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo de las barras
                borderColor: 'rgba(75, 192, 192, 1)', // Color del borde de las barras
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                annotation: {
                    annotations: {
                        highlight: {
                            type: 'box',
                            xMin: arrayLabels.sort() - 10,
                            xMax: arrayLabels.sort() -1,
                            yMin: 1.80, // Valor del eje Y a partir del cual deseas cambiar el color
                            yMax: Math.max(...arrayData), // Valor máximo del eje Y para cubrir todo el rango
                            backgroundColor: 'rgba(255,99,71)', 
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true // Empieza el eje Y en cero
                }
            }
        }
    });
    }


function get_mes(variable){
    
    console.log(variable)
    fecha = variable? variable.fecha.split("-"):null
   
    console.log(fecha)
    if (fecha[1] === "01") {
        meses[0].valor.push(variable.valor);
        meses[0].dia.push(variable.fecha);
    } else if (fecha[1] === "02") {
        meses[1].valor.push(variable.valor);
        meses[1].dia.push(variable.fecha);
    } else if (fecha[1] === "03") {
        meses[2].valor.push(variable.valor);
        meses[2].dia.push(variable.fecha);
    } else if (fecha[1] === "04") {
        meses[3].valor.push(variable.valor);
        meses[3].dia.push(variable.fecha);
    } else if (fecha[1] === "05") {
        meses[4].valor.push(variable.valor);
        meses[4].dia.push(variable.fecha);
    } else if (fecha[1] === "06") {
        meses[5].valor.push(variable.valor);
        meses[5].dia.push(variable.fecha);
    } else if (fecha[1] === "07") {
        meses[6].valor.push(variable.valor);
        meses[6].dia.push(variable.fecha);
    } else if (fecha[1] === "08") {
        meses[7].valor.push(variable.valor);
        meses[7].dia.push(variable.fecha);
    } else if (fecha[1] === "09") {
        meses[8].valor.push(variable.valor);
        meses[8].dia.push(variable.fecha);
    } else if (fecha[1] === "10") {
        meses[9].valor.push(variable.valor);
        meses[9].dia.push(variable.fecha);
    } else if (fecha[1] === "11") {
        meses[10].valor.push(variable.valor);
        meses[10].dia.push(variable.fecha);
    } else if (fecha[1] === "12"){
        meses[11].valor.push(variable.valor);
        meses[11].dia.push(variable.fecha);
    } else {
        return ""
    }
    

    console.log(meses)
}

function recorrer_meses(datos){
    for(let item of datos){
        console.log(item)
        get_mes(item)
    }
}


seleccionadorMes.addEventListener("change", () => {
    if (myChart) {
        myChart.destroy(); // Elimina el gráfico anterior
    }
    localStorage.setItem("Mes", JSON.stringify(seleccionadorMes.value))
    tipo_grafica1(seleccionadorMes.value)
    
})

