let button_Buscador = document.getElementById("buscador")
let desde = document.getElementById("desde")
let hasta = document.getElementById("hasta")

///////*INSULINA
let container_registros2 = document.getElementById("container_insulina2")

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
        container_registros2.innerHTML += ` <tr>
             <td>${array[i].hora}</td>
              <td>${array[i].unidades}</td>
              <td>${array[i].tipo}</td>
               <td>${array[i].momento==="Pre Desayuno"?"Ayunas":array[i].momento}</td>
                <td>${array[i].notas}</td>        
        </tr>`
    }
    }


    //////////////VALORES

    let container_glucemia = document.getElementById("container_registros2")

    function view_resultados(array) {
        // Ordenar por fecha y hora
        array.sort((a, b) => {
            const dateA = toDateTime(a.fechaString, a.hora);
            const dateB = toDateTime(b.fechaString, b.hora);
            return dateB - dateA; // Ordenar de más reciente a más antiguo
        });
    
        for (let i in array) {
            container_glucemia.innerHTML += ` <tr class=${color_row(array[i].valor)}>
                <td>${array[i].fechaString}</td>
                 <td>${array[i].hora}</td>
                  <td>${array[i].valor}</td>
                   <td>${array[i].momento==="Pre Desayuno"?"Ayunas":array[i].momento}</td>
                    <td>${array[i].notas}</td>
            </tr>`
        }}

        function color_row(valor){
            if (valor > 180 ){
                return("table-danger")
            } else if (valor < 70) {
        return ("table-primary") 
        } else {
                return("table-success")
            }
        
        }

        button_Buscador.addEventListener("click", ()=>{

            let fechaInicio = desde.value
            let fechaFinal = hasta.value


            if (!fechaInicio || !fechaFinal) {
                console.error("Por favor ingresa ambas fechas.");
                return;
            }

            loadPage(fechaInicio,fechaFinal)


        })

        async function getValores(fechaInicio, fechaFinal) {

            try {
                let token = localStorage.getItem("token")
                const userId = localStorage.getItem('id')
                const [response1, response2] = await Promise.all([ 
                    fetch(`https://backend-glucemia.vercel.app/buscar?userId=${userId}&desde=${fechaInicio}&hasta=${fechaFinal}`, 
                    {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                fetch(
                    `https://backend-glucemia.vercel.app/buscarInsulina?userId=${userId}&desde=${fechaInicio}&hasta=${fechaFinal}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                )
            ]);

                const result1 = response1.ok ? await response1.json() : null;
                const result2 = response2.ok ? await response2.json() : null;
        
                return { result1, result2 };
            } catch (e) {
                console.error("Error: ", e);
            }
        }


        let arrayResultados =[]

        async function loadPage(fechaInicio, fechaFinal) {
            const data = await getValores(fechaInicio, fechaFinal)
            if (data) {
                arrayResultados.push(data);
                console.log("Datos obtenidos:", data);
        
                // Ejemplo: Mostrar resultados en la consola
                if (data.result1) {
                    console.log("Registros de glucemia:", data.result1);
                } else {
                    console.warn("No se encontraron registros de glucemia.");
                }
        
                if (data.result2) {
                    console.log("Registros de insulina:", data.result2);
                } else {
                    console.warn("No se encontraron registros de insulina.");
                }
            } else {
                console.error("No se obtuvieron datos.");
            }
         }

