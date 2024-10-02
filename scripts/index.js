
getValores()

///////////MANEJO DE FECHAS/////////////////
const checkbox_now = document.getElementById("notNow")
let container = document.getElementById("container_fecha")

let fecha_Actual = new Date()
const MESES = ["01", "02", "03", "04", "05", "06", "07",
    "08", "09", "10", "11", "12"]

let mes_Actual = MESES[fecha_Actual.getMonth()]<10? `0${MESES[fecha_Actual.getMonth()]}`:MESES[fecha_Actual.getMonth()]
let año_Actual = fecha_Actual.getFullYear()
let numeroDia_Actual = fecha_Actual.getDate()<10? `0${fecha_Actual.getDate()}`:fecha_Actual.getDate()

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
                mostrarToast()
                setTimeout(() => {
                    localStorage.removeItem("fecha")
                    localStorage.removeItem("fechaComparativa")
                    localStorage.removeItem("hora")
                    localStorage.removeItem("mg/dL")
                    localStorage.removeItem("Momento")
                    localStorage.removeItem("Texto")
                    location.reload()
                }, 1500)
            } else {
                
                    console.error('Error en la solicitud:', response.status, await response.text());
                }
        
        } catch (error) {
            console.error('Error al hacer la solicitud:', error);
        }

    }

}
)

function mostrarToast() {
    var miToast = document.getElementById('miToast');
    var cartel = new bootstrap.Toast(miToast);
    cartel.show();
}

function errorToast() {
    var miToast = document.getElementById('miNOToast');
    var cartel = new bootstrap.Toast(miToast);
        cartel.show();
    }



async function getValores() {
    try {
        let token = localStorage.getItem("token");
        const userId = localStorage.getItem('id');
        const response = await fetch(`https://backend-glucemia.vercel.app/?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            tipo_grafica(result);

            
            let ultimo = result[result.length - 1].fecha;
            let ultimo_corte = ultimo.split("-");
            let ultimo_mes = ultimo_corte[1];

            if (mes_Actual !== ultimo_mes) {
                console.log(ultimo_mes);
                console.log(mes_Actual);
                let email = localStorage.getItem("user");
                email_registrosMensuales(email);
            }
        }
    } catch (e) {
        console.error("Error: ", e);
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

function toDateTime(fecha, hora) {
    const [day, month, year] = fecha.split('-').map(Number);
    const [hours, minutes] = hora.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes); // Mes - 1 porque es 0-indexado
}


function tipo_grafica(mes){

   
    
    // Combinar fechaString y valor en un nuevo array
const combinedArray = mes.map(item => ({
    fechaString: item.fechaString,
    hora: item.hora,
    valor: item.valor,
}));

// Ordenar por fecha y hora
combinedArray.sort((a, b) => {
    const dateA = toDateTime(a.fechaString, a.hora); // Asegúrate de obtener la hora correspondiente
    const dateB = toDateTime(b.fechaString, b.hora);
    return dateA - dateB;
});

// Extraer labels y data ordenados
const arrayLabels = combinedArray.map(item => item.fechaString);

let arrayData = []
    for (let i=0; i<combinedArray.length;i++){
        arrayData.push(combinedArray[i].valor)
    }

let ultimos10 = arrayLabels.slice(-10)
    if (ultimos10.length < 1) return;
    myChart1 = new Chart(ctz, {
        type: 'line', // Tipo de gráfico: bar, line, pie, etc.
        data: {
            labels: arrayLabels, // Etiquetas en el eje X
            datasets: [{
                label: 'Valor (mg/dL) en el Mes Actual',
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
                            xMin: ultimos10[0],
                            xMax: ultimos10[ultimos10.length -1],
                            yMin: 180, // Valor del eje Y a partir del cual deseas cambiar el color
yMax: 700, 
                            
                            backgroundColor: 'rgba(255, 99, 132, 0.5)', 
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }, highlight2: {
                            type: 'box',
                            xMin: ultimos10[0],
                            xMax: ultimos10[ultimos10.length -1],
                            yMin: 0, // Nivel más bajo
                            yMax: 70, // Nivel más alto
                            backgroundColor: 'rgba(80, 133, 188, 0.5)',
                            borderColor: 'rgba(80, 133, 188, 1)',
                            borderWidth: 1
                        }, highlight3: {
                            type: 'box',
                            xMin: ultimos10[0],
                            xMax: ultimos10[ultimos10.length -1],
                            yMin: 70, // Nivel más bajo
                            yMax: 180, // Nivel más alto
                            backgroundColor: 'rgba(0, 128, 0, 0.25)',
                            borderColor: 'rgba(0, 128, 0, 1)',
                            borderWidth: 1
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: {
                        display: false  // Desactiva las líneas guías en el eje Y
                    },
                    beginAtZero: true // Empieza el eje Y en cero
                }
            }
        }
    });
    }


    //////////////////////////////Eliminar Registros Antiguos////////////////////////////

    async function eliminarRegistrosAntiguos() {
        try {
          const response = await fetch('/delete-old', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
          }
      
          const data = await response.json();
          console.log(data.message); // Mensaje de éxito
        } catch (error) {
          console.error('Error al eliminar registros:', error.message);
        }
      }
      
      
      eliminarRegistrosAntiguos();
      
      document.addEventListener('DOMContentLoaded', function () {
        const lastMonth = localStorage.getItem('lastMonth');
const currentMonth = new Date().getMonth(); // Obtiene el mes actual (0-11)



// Actualiza el mes almacenado en localStorage
localStorage.setItem('lastMonth', currentMonth);
})
    
    async function email_registrosMensuales(email) {

        const rangoNormal = localStorage.getItem("normal")
        const rangoAlto = localStorage.getItem("alto")
        const rangoBajo = localStorage.getItem("bajo")
        const valores = localStorage.getItem("nivelGlucosa")
        const subject = "Informe mensual"
        let token = localStorage.getItem("token")
        const message = ` <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: rgb(21, 184, 162);; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <h1 style="color: #e7e4e4;text-align: center;">¡Hola!</h1>
                    
                    <p>A continuación te comparto información acerca de tu último mes: </p>
                    <ul>
                        <li>Su porcentaje en rango fue de: ${rangoNormal} %</li>
                        <li>Su porcentaje por encima del rango fue de: ${rangoAlto} %</li>
                        <li>Su porcentaje por debajo del rango fue de: ${rangoBajo} %</li>
                        <li>Su nivel promedio de Glucosa fue de: ${valores} (mg/dL)</li>
                        <li>No sabe cuanta Insulina darse? Utilice nuestra <a href="https://maximilianosena.github.io/pancrealculator/">Calculadora</a></li>
                    </ul>
                    <p>Deseamos serle de mucha ayuda.</p>
                    <footer style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; color: #aaa;">
                        <p>Muchas Gracias.</p>
                    </footer>
                </div>
            </body>
        </html>`
        try {
            const response = await fetch('https://backend-glucemia.vercel.app/send-email-mensual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email, subject, message })
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error al enviar el correo:', errorText);
               
                return;
            }
    
            const result = await response.json();
            if (result.success) {
                console.log('Email enviado!');
            } else {
                console.log('Error al enviar el email');
            }
    
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            
        }
    }
    

    async function email_bienvenida(email, alias) {
        let token = localStorage.getItem("token")
        const subject = "Bienvenido a su calendario Glucémico"
    
        const message = ` <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: rgb(21, 184, 162);; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <h1 style="color: #e7e4e4;text-align: center;">¡Bienvenido!</h1>
                    <h3 style="color: #131212;text-align: center;">Hola ${alias}!</h3>
                    <p>Gracias por utilizar esta aplicación, espero que sea de su agrado y le brinde la ayuda que necesita </p>
                    <ul>
                        <li>Lleve adelante sus registros de valores (mg/dL) </li>
                        <li>Revise el historial en cualquier momento para saber cuantas unidades de Insulina se dió</li>
                        <li>Obtenga un promedio de sus valores y cuanto tiempo estuvo en rango</li>
                        <li>No sabe cuanta Insulina darse? Utilice nuestra <a href="https://maximilianosena.github.io/pancrealculator/">Calculadora</a></li>
                    </ul>
                    <p>Deseamos serle de mucha ayuda.</p>
                    <footer style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; color: #aaa;">
                        <p>Muchas Gracias.</p>
                    </footer>
                </div>
            </body>
        </html>`
        try {
            const response = await fetch('https://backend-glucemia.vercel.app/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email, subject, message })
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error al enviar el correo:', errorText);
                
                return;
            }
    
            const result = await response.json();
            if (result.success) {
                console.log('Email enviado!');
            } else {
                console.log('Error al enviar el email');
            }
    
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            
        }
    }

    
document.addEventListener('DOMContentLoaded', function () {
    
        const primerVez = localStorage.getItem('primeraVez');
    
        if (primerVez === "true") {
            let email = localStorage.getItem("email");
            let alias = localStorage.getItem("alias");
            email_bienvenida(email, alias);
            localStorage.setItem('primeraVez', "false");
        } else {
        console.log("Ya ingresó")
    }
    
})

