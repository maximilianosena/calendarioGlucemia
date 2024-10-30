


///////////MANEJO DE FECHAS/////////////////
const checkbox_now = document.getElementById("notNowInsulina")
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

localStorage.setItem("fechaComparativaI", JSON.stringify(fecha_Actual.toISOString()))
localStorage.setItem("fechaI", JSON.stringify(obj_fecha))
localStorage.setItem("horaI", JSON.stringify(obj_hora))


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

                localStorage.setItem("horaI", JSON.stringify(obj_horaHistorial))
            } else if (historial_Hora.value.length > 4 && historial_Hora.value.includes(":")) {
              

                let hora = `${valor1}${valor2}`
                let minutos = `${valor3}${valor4}`

                let obj_horaHistorial = `${hora}:${minutos}`

                localStorage.setItem("horaI", JSON.stringify(obj_horaHistorial))
            } else {
                alert("Ingrese valores numéricos validos")
                localStorage.setItem("fechaI", JSON.stringify(obj_fecha))
                localStorage.setItem("horaI", JSON.stringify(obj_hora))
            }
            localStorage.setItem("fechaI", JSON.stringify(obj_fechaHistorial))
            localStorage.setItem("fechaComparativaI", JSON.stringify(fecha_comparativa.toISOString()))
        })

    } else {
        container.innerHTML = ""
        localStorage.setItem("fechaI", JSON.stringify(obj_fecha))
        localStorage.setItem("horaI", JSON.stringify(obj_hora))
    }
})



//////////////////////MANEJO SELECT///////////////////////////////////////

let seleccionadorTipo = document.getElementById("tipoInsulina")

seleccionadorTipo.addEventListener("change", () => {
    localStorage.setItem("TipoInsulina", JSON.stringify(seleccionadorTipo.value))
})

let seleccionador = document.getElementById("momentoInsulina")

seleccionador.addEventListener("change", () => {
    localStorage.setItem("MomentoI", JSON.stringify(seleccionador.value))
})

let input_Unidades = document.getElementById("unidades")

let texto = document.getElementById("notasInsu")



let button_submit = document.getElementById("anotacionInsulina")


button_submit.addEventListener("submit", async (e) => {

    e.preventDefault()
    if (isNaN(input_Unidades.value) || input_Unidades.value == "") {
        alert("Indique las unidades")
    } else if (!JSON.parse(localStorage.getItem("MomentoI"))) {
        alert("Indique un momento del día")
    }
    else {
        let fechaComparativaI= new Date(JSON.parse(localStorage.getItem("fechaComparativaI")));
        localStorage.setItem("TextoI", JSON.stringify(texto.value))
        localStorage.setItem("unidades", JSON.stringify(input_Unidades.value))
        let nuevo_registro = {
            fecha: fechaComparativaI,
            fechaString: JSON.parse(localStorage.getItem("fechaI")),
            hora: JSON.parse(localStorage.getItem("horaI")),
            unidades: JSON.parse(localStorage.getItem("unidades")),
            tipo:JSON.parse(localStorage.getItem("TipoInsulina")),
            momento: JSON.parse(localStorage.getItem("MomentoI")),
            notas: JSON.parse(localStorage.getItem("TextoI"))
        }

        console.log(nuevo_registro)
        try {
            let token = localStorage.getItem("token")
            const response = await fetch('https://backend-glucemia.vercel.app/nuevo_registroInsulina', {
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
                    localStorage.removeItem("fechaComparativaI")
                    localStorage.removeItem("hora")
                    localStorage.removeItem("unidades")
                    localStorage.removeItem("TipoInsulina")
                    
                    localStorage.removeItem("Momento")
                    localStorage.removeItem("TextoI")
                    location.reload()
                }, 1000)
            } else {
                    errorToast()
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

let btn_close = document.getElementById("close")

btn_close.addEventListener("click", () => {
    localStorage.clear()
    location.reload()
})