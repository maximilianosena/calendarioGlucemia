
getValores()

///////////MANEJO DE FECHAS/////////////////
const checkbox_now = document.getElementById("notNow")
let container = document.getElementById("container_fecha")

let fecha_Actual = new Date()
const MESES = ["01", "02", "03", "04", "05", "06", "07",
    "08", "09", "10", "11", "12"]

let mes_Actual = MESES[fecha_Actual.getMonth()]
let año_Actual = fecha_Actual.getFullYear()
let numeroDia_Actual = fecha_Actual.getDate() < 10 ? `0${fecha_Actual.getDate()}` : fecha_Actual.getDate()

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
            <input type="text" name="hora" id="hora_registro" class="form-control" placeholder="Formato HH:mm, ejemplo 22:45">
        </div>
        <br>
        <button id="fecha_creada" class="btn btn-success">Hecho</button>
        `;

        let historial_Fecha = document.getElementById("fecha");
        let historial_Hora = document.getElementById("hora_registro");
        let button_hecho = document.getElementById("fecha_creada");

        button_hecho.addEventListener("click", (e) => {
            e.preventDefault();

            // Validación de la fecha
            let fecha_comparativa = new Date(historial_Fecha.value);
            if (!historial_Fecha.value) {
                alert("Por favor, ingrese una fecha válida.");
                return;
            }

            let fecha_Desglosada = historial_Fecha.value.split("-");
            let año_Historial = fecha_Desglosada[0];
            let mes_Historial = fecha_Desglosada[1];
            let dia_Historial = fecha_Desglosada[2];

            let obj_fechaHistorial = `${dia_Historial}-${mes_Historial}-${año_Historial}`;

            // Validación de la hora
            let horaFormatoRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // Formato HH:mm
            if (!horaFormatoRegex.test(historial_Hora.value)) {
                alert("Inserte un horario válido en el formato HH:mm, ejemplo 22:45");
                return;
            }

            let [hora, minutos] = historial_Hora.value.split(":");
            let obj_horaHistorial = `${hora}:${minutos}`;

            console.log(`Fecha válida: ${obj_fechaHistorial}`);
            console.log(`Hora válida: ${obj_horaHistorial}`);

            // Guardar en localStorage
            localStorage.setItem("hora", JSON.stringify(obj_horaHistorial));
            localStorage.setItem("fecha", JSON.stringify(obj_fechaHistorial));
            localStorage.setItem("fechaComparativa", JSON.stringify(fecha_comparativa.toISOString()));
        });
    } else {
        container.innerHTML = "";
        localStorage.removeItem("fecha");
        localStorage.removeItem("hora");
    }
});



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
        }
    } catch (e) {
        console.error("Error: ", e);
    }
}



///////////////////////Mandar Mail Mensual/////////////////////////////

async function sendMailMensual() {
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
           
                let email = localStorage.getItem("user");
                email_registrosMensuales(email);
        
        }
    } catch (e) {
        console.error("Error: ", e);
    }
}

let fechaMail=localStorage.getItem("fecha")
let dia1 = fechaMail.split("-")

console.log("Hoy es", dia1[0])


if (dia1[0] === `"01`) {
  if (localStorage.getItem("correoEnviado") !== "true") {
           console.log("Hoy es 1, enviando correo");
        sendMailMensual(); 
        localStorage.setItem("correoEnviado", "true"); 
    }
} else {
   console.log("Dia del mes")
   localStorage.setItem("correoEnviado", "false");
}

///////////////////////Cerrar Sesión///////////////////////////////////

let btn_close = document.getElementById("close")

btn_close.addEventListener("click", () => {
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


function tipo_grafica(mes) {
    // Combinar fechaString y valor en un nuevo array
    const combinedArray = mes.map(item => ({
        fechaString: item.fechaString,
        hora: item.hora,
        valor: item.valor,
    }));

    // Ordenar por fecha y hora
    combinedArray.sort((a, b) => {
        const dateA = toDateTime(a.fechaString, a.hora);
        const dateB = toDateTime(b.fechaString, b.hora);
        return dateA - dateB;
    });

    // Extraer labels y data ordenados
    const arrayLabels = combinedArray.map(item => item.fechaString);
    const arrayData = combinedArray.map(item => item.valor);

    // Obtener los últimos 10 elementos
    const ultimos10 = arrayLabels.slice(-10);
    const ultimos10datos = arrayData.slice(-10);

    if (ultimos10.length < 1) return;

    // Crear el gráfico
    myChart1 = new Chart(ctz, {
        type: 'line', // Tipo de gráfico
        data: {
            labels: ultimos10, // Etiquetas en el eje X (últimos 10)
            datasets: [{
                label: 'Valor (mg/dL) en el Mes Actual',
                data: ultimos10datos, // Datos de cada barra (últimos 10)
                backgroundColor: 'black', // Color de fondo
                borderColor: 'black', // Color del borde
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                annotation: {
                    annotations: {
                        highlight: {
                            type: 'box',
                            xMin: ultimos10[0],
                            xMax: ultimos10[ultimos10.length - 1],
                            yMin: 180,
                            yMax: 600,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        },
                        highlight2: {
                            type: 'box',
                            xMin: ultimos10[0],
                            xMax: ultimos10[ultimos10.length - 1],
                            yMin: 0,
                            yMax: 70,
                            backgroundColor: 'rgba(80, 133, 188, 0.5)',
                            borderColor: 'rgba(80, 133, 188, 1)',
                            borderWidth: 1
                        },
                        highlight3: {
                            type: 'box',
                            xMin: ultimos10[0],
                            xMax: ultimos10[ultimos10.length - 1],
                            yMin: 70,
                            yMax: 180,
                            backgroundColor: 'rgba(0, 128, 0, 0.25)',
                            borderColor: 'rgba(0, 128, 0, 1)',
                            borderWidth: 1
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: ultimos10[0],
                    max: ultimos10[ultimos10.length - 1],
                },
                y: {
                    grid: {
                        display: false
                    },
                    max: 600,
                    beginAtZero: true
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

