let texto = document.getElementById("pastilla")

let button_submit = document.getElementById("submit")

let container = document.getElementById("registro_pastilla")


let fecha_Actual = new Date()
const MESES = ["01", "02", "03", "04", "05", "06", "07",
    "08", "09", "10", "11", "12"]

let mes_Actual = MESES[fecha_Actual.getMonth()] < 10 ? `0${MESES[fecha_Actual.getMonth()]}` : MESES[fecha_Actual.getMonth()]
let año_Actual = fecha_Actual.getFullYear()
let numeroDia_Actual = fecha_Actual.getDate() < 10 ? `0${fecha_Actual.getDate()}` : fecha_Actual.getDate()

let obj_fecha = `${numeroDia_Actual}-${mes_Actual}-${año_Actual}`

let getHoras = fecha_Actual.getHours()
let hora_Actual = getHoras < 10 ? `0${getHoras}` : getHoras
let minutos_Actual = fecha_Actual.getMinutes()
console.log(minutos_Actual)
let minutero = minutos_Actual < 10 ? `0${minutos_Actual}` : minutos_Actual
let obj_hora = `${hora_Actual}:${minutero}`

localStorage.setItem("fechaComparativaPasti", JSON.stringify(fecha_Actual.toISOString()))
localStorage.setItem("fechaPasti", JSON.stringify(obj_fecha))
localStorage.setItem("horaPasti", JSON.stringify(obj_hora))

button_submit.addEventListener("click", async (e) => {
    e.preventDefault();

    if (texto.value.trim() === "") {
        alert("Ingrese un nombre");
    } else {
        let nombre = texto.value.toUpperCase();

       
        if (!arrayResultados.some(item => item.tipo === nombre)) {
            
            localStorage.setItem("pasti", JSON.stringify(nombre));
            let fechaComparativa = new Date(JSON.parse(localStorage.getItem("fechaComparativa")));
            let nuevo_registro = {
                fecha: fechaComparativa,
                fechaString: JSON.parse(localStorage.getItem("fechaPasti")),
                hora: JSON.parse(localStorage.getItem("horaPasti")),
                tipo: JSON.parse(localStorage.getItem("pasti"))
            };

            try {
                let token = localStorage.getItem("token");
                const response = await fetch('https://backend-glucemia.vercel.app/nueva_Pastilla', {
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
                        localStorage.removeItem("fechaPasti");
                        localStorage.removeItem("fechaComparativa");
                        localStorage.removeItem("horaPasti");
                        localStorage.removeItem("pasti");
                        location.reload();
                    }, 1500);
                } else {
                    console.error('Error en la solicitud:', response.status, await response.text());
                }
            } catch (error) {
                console.error('Error al hacer la solicitud:', error);
            }
        } else {
            // Si el nombre ya está registrado
            alert("Pastilla ya registrada");
        }
    }
});

function toDateTime(fecha, hora) {
    const [day, month, year] = fecha.split('-').map(Number);
    const [hours, minutes] = hora.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes); // Mes - 1 porque es 0-indexado
}

    function view_resultados(array) {
        // Ordenar por fecha y hora
        array.sort((a, b) => {
            const dateA = toDateTime(a.fechaString, a.hora);
            const dateB = toDateTime(b.fechaString, b.hora);
            return dateB - dateA; // Ordenar de más reciente a más antiguo
        });
    
        for (let i in array) {
            container.innerHTML += ` <tr style="text-align: center;">
                <td>${array[i].tipo}</td>
                 <td>${array[i].fechaString}</td>
                    <td>${array[i].hora}</td>
                     <td><button id=${array[i].tipo} name="actualizar" class="btn btn-info">Actualizar</button></td>  
                      <td><button id=${array[i].id} name="borrar" class="btn btn-danger">X</button></td>        
            </tr>`
        }

        container.addEventListener('click', (event) => {
            if (event.target.name === 'actualizar') {
                const tipo = event.target.id;  // Obtenemos el id del botón
                console.log("Hago click en id: ", tipo);
                console.log(`URL de la solicitud: https://backend-glucemia.vercel.app/actualizarPastilla/${tipo}`);
                actualizarRegistro(tipo);
            }
        })

        container.addEventListener('click', (event) => {
            if (event.target.name === 'borrar') {
                const id = event.target.id;  // Obtenemos el id del botón
                console.log("Hago click en id: ", id);
    
                deleteRegistro(id);
            }
            })
        }

    let arrayResultados =[]

    async function getValores() {
        try {
            let token = localStorage.getItem("token")
            const userId = localStorage.getItem('id')
            const response = await fetch(`https://backend-glucemia.vercel.app/view_pastillas?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    
    
            if (response.ok) {
                
                const result = await response.json()
                console.log(result)
                arrayResultados.push(result)
                view_resultados(result)
            }
        }
        catch (e) {
            console.error("Error: ", e)
        }
    
    }

    async function actualizarRegistro(tipo) {

        let fechaComparativa = new Date(JSON.parse(localStorage.getItem("fechaComparativa")));
        let nuevo_registro = {
            fecha: fechaComparativa,
            fechaString: JSON.parse(localStorage.getItem("fechaPasti")),
            hora: JSON.parse(localStorage.getItem("horaPasti"))
        };
        console.log(nuevo_registro)
        try {
            let token = localStorage.getItem("token")
            const response = await fetch(`https://backend-glucemia.vercel.app/actualizarPastilla/${tipo}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevo_registro),
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

    async function deleteRegistro(id) {

        try {
            let token = localStorage.getItem("token")
            const response = await fetch(`https://backend-glucemia.vercel.app/borrar_Pasti/${id}`, {
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
    getValores()