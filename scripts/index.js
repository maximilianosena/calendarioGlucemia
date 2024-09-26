getValores()

///////////MANEJO DE FECHAS/////////////////
const checkbox_now = document.getElementById("notNow")
let container = document.getElementById("container_fecha")

let fecha_Actual = new Date()
const MESES = ["01", "02", "03", "04", "05", "06", "07",
    "08", "09", "10", "11", "12"]

let mes_Actual = MESES[fecha_Actual.getMonth()]
let año_Actual = fecha_Actual.getFullYear()
let numeroDia_Actual = fecha_Actual.getDate()

let obj_fecha = `${numeroDia_Actual}-${mes_Actual}-${año_Actual}`

let getHoras = fecha_Actual.getHours()
let hora_Actual = getHoras < 10 ? `0${getHoras}` : getHoras
let minutos_Actual = fecha_Actual.getMinutes()
console.log(minutos_Actual)
let minutero = minutos_Actual < 10 ? `0${minutos_Actual}` : minutos_Actual
let obj_hora = `${hora_Actual}:${minutero}`

localStorage.setItem("fechaComparativa", JSON.stringify(fecha_Actual.toISOString()))
localStorage.setItem("fecha", JSON.stringify(obj_fecha))
localStorage.setItem("hora", JSON.stringify(obj_hora))


////////////////////////////////////

checkbox_now.addEventListener("change", () => {
    if (checkbox_now.checked) {
        container.innerHTML += `
        <hr>
    <div class="form-date">
        <label for="fecha">Fecha:</label>
        <input type="date" id="fecha" name="fecha_registro"/>
    </div>
    <hr>
    <div class="input-group">
        <span class="input-group-text">Hora</span>
        <input type="datetime" name="hora" id="hora_registro" class="form-control">
    </div>
        <br>
        <button id="fecha_creada" class="btn btn-success">Hecho</button>
        `

        let historial_Fecha = document.getElementById("fecha")
        let historial_Hora = document.getElementById("hora_registro")
        let button_hecho = document.getElementById("fecha_creada")



        button_hecho.addEventListener("click", (e) => {
            e.preventDefault()
            
            let fecha_comparativa = new Date(historial_Fecha.value)
            let fecha_Desglosada = historial_Fecha.value.split("-")
            let año_Historial = fecha_Desglosada[0]
            let mes_Historial = fecha_Desglosada[1]
            let dia_Historial = fecha_Desglosada[2]

            let obj_fechaHistorial = `${dia_Historial}-${mes_Historial}-${año_Historial}`
                let valor1 = historial_Hora.value[0]
                let valor2 = historial_Hora.value[1]
                let valor3 = historial_Hora.value[2]
                let valor4 = historial_Hora.value[3]
            
            if (valor1 >2 || valor1 == 2 && valor2 >3 || valor3 > 5) {
                alert ("Inserte un horario válido")
            }
             else if (historial_Hora.value.length == 4 && !isNaN(historial_Hora.value)) {
               

                let hora = `${valor1}${valor2}`
                let minutos = `${valor3}${valor4}`

                let obj_horaHistorial = `${hora}:${minutos}`

                localStorage.setItem("hora", JSON.stringify(obj_horaHistorial))
            } else if (historial_Hora.value.length > 4 && historial_Hora.value.includes(":")) {
              

                let hora = `${valor1}${valor2}`
                let minutos = `${valor3}${valor4}`

                let obj_horaHistorial = `${hora}:${minutos}`

                localStorage.setItem("hora", JSON.stringify(obj_horaHistorial))
            } else {
                alert("Ingrese valores numéricos validos")
                localStorage.setItem("fecha", JSON.stringify(obj_fecha))
                localStorage.setItem("hora", JSON.stringify(obj_hora))
            }
            localStorage.setItem("fecha", JSON.stringify(obj_fechaHistorial))
            localStorage.setItem("fechaComparativa", JSON.stringify(fecha_comparativa.toISOString()))
        })

    } else {
        container.innerHTML = ""
        localStorage.setItem("fecha", JSON.stringify(obj_fecha))
        localStorage.setItem("hora", JSON.stringify(obj_hora))
    }
})



//////////////////////MANEJO SELECT///////////////////////////////////////

let seleccionador = document.getElementById("momento")

seleccionador.addEventListener("change", () => {
    localStorage.setItem("Momento", JSON.stringify(seleccionador.value))
})


//////////////////////MANEJO VALOR INDICE///////////////////////////////////////
/////////////////////MANEJO CAMPO NOTAS ///////////////////////////////////////

let input_Glucemia = document.getElementById("valor")

let texto = document.getElementById("notas")



let button_submit = document.getElementById("anotacion")


button_submit.addEventListener("submit", async (e) => {

    e.preventDefault()
    if (isNaN(input_Glucemia.value) || input_Glucemia.value == "") {
        alert("Indique un valor mg/dL")
    } else if (!JSON.parse(localStorage.getItem("Momento"))) {
        alert("Indique un momento del día")
    }
    else {
        let fechaComparativa = new Date(JSON.parse(localStorage.getItem("fechaComparativa")));
        localStorage.setItem("Texto", JSON.stringify(texto.value))
        localStorage.setItem("mg/dL", JSON.stringify(input_Glucemia.value))
        let nuevo_registro = {
            fecha: fechaComparativa,
            fechaString: JSON.parse(localStorage.getItem("fecha")),
            hora: JSON.parse(localStorage.getItem("hora")),
            valor: JSON.parse(localStorage.getItem("mg/dL")),
            momento: JSON.parse(localStorage.getItem("Momento")),
            notas: JSON.parse(localStorage.getItem("Texto"))
        }

        console.log(nuevo_registro)
        try {
            let token = localStorage.getItem("token")
            const response = await fetch('https://backend-glucemia.vercel.app/nuevo_registro', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(nuevo_registro),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Respuesta del servidor:', result);
                setTimeout(() => {
                    localStorage.removeItem("fecha")
                    localStorage.removeItem("fechaComparativa")
                    localStorage.removeItem("hora")
                    localStorage.removeItem("mg/dL")
                    localStorage.removeItem("Momento")
                    localStorage.removeItem("Texto")
                    location.reload()
                }, 1000)
            } else {
                
                    console.error('Error en la solicitud:', response.status, await response.text());
                }
        
        } catch (error) {
            console.error('Error al hacer la solicitud:', error);
        }

    }

}
)

async function getValores() {
    try {
        let token = localStorage.getItem("token")
        const response = await fetch(`https://backend-glucemia.vercel.app/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.ok) {
            const result = await response.json()
            console.log(result)
            tipo_grafica(result)
            view_Last_Resultados(result)
        }
    }
    catch (e) {
        console.error("Error: ", e)
    }

}

    const carouselContent = document.getElementById('carousel-content');
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');

    function view_Last_Resultados(result) {
        const lastFive = result.length > 5 ? result.slice(-5) : result;
    
        if (lastFive.length === 0) {
            carouselItem.innerHTML = 'No hay resultados para mostrar.';
            return;
        } else {
            lastFive.forEach(item => {
                // Crear un nuevo carousel-item para cada resultado
                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
    
                // Añadir el contenido con interpolación
                carouselItem.innerHTML = `
                    <span>${item.fechaString} : ${item.valor}mg/dL</span>
                `;
    
                // Agregar el nuevo item al contenedor del carousel
                carouselContent.appendChild(carouselItem);
            });
    
            // Si deseas que el primer item sea el activo
            const firstItem = carouselContent.querySelector('.carousel-item');
            if (firstItem) {
                firstItem.classList.add('active');
            }
        }
    }

///////////////////////Cerrar Sesión///////////////////////////////////

let btn_close = document.getElementById("close")

btn_close.addEventListener("click", ()=>{
    localStorage.clear()
    location.reload()
})

/////////////////////////Grafica Mes Actual/////////////////////

const ctz = document.getElementById('myChart1').getContext('2d');
let myChart1; 



function tipo_grafica(mes){

   
    
    let arrayLabels =[]

        for (let i = 0; i < mes.length; i++) {
            arrayLabels.push(mes[i].fechaString); 
        }
        
    
    let arrayData = []
    for (let i=0; i<mes.length;i++){
        arrayData.push(mes[i].valor)
    }
    
    myChart1 = new Chart(ctz, {
        type: 'line', // Tipo de gráfico: bar, line, pie, etc.
        data: {
            labels: arrayLabels, // Etiquetas en el eje X
            datasets: [{
                label: 'Valores en el Mes Actual',
                data: arrayData, // Datos de cada barra
                backgroundColor: 'black', // Color de fondo de las barras
                borderColor: 'black', // Color del borde de las barras
                borderWidth: 2
            }]
        },
        options: {
            responsive: true, // Hacer el gráfico responsive
        maintainAspectRatio: false, // Permitir cambiar la relación de aspecto
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