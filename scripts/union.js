let button_Buscador = document.getElementById("buscador")
let desde = document.getElementById("desde")
let hasta = document.getElementById("hasta")

///////*INSULINA
let container_insulina2 = document.getElementById("container_insulina2")

function toDateTime(fecha, hora) {
    const [day, month, year] = fecha.split('-').map(Number);
    const [hours, minutes] = hora.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes); // Mes - 1 porque es 0-indexado
}



function view_resultados1(array) {

    container_insulina2=""
    for (let i = 0; i < array.length; i++) {
        container_insulina2.innerHTML += ` <tr>
        <td>${array[i].fecha}</td>
             <td>${array[i].hora}</td>
              <td>${array[i].unidades}</td>
              <td>${array[i].tipo}</td>
               <td>${array[i].momento==="Pre Desayuno"?"Ayunas":array[i].momento}</td>
                <td>${array[i].notas}</td>        
        </tr>`
    }
    }


    //////////////VALORES

    let container_glucemia2 = document.getElementById("container_registros2")

    function view_resultados2(array) {
        // Ordenar por fecha y hora
        array.sort((a, b) => {
            const dateA = toDateTime(a.fechaString, a.hora);
            const dateB = toDateTime(b.fechaString, b.hora);
            return dateB - dateA; // Ordenar de más reciente a más antiguo
        });
        
        console.log(array)
        container_glucemia2.innerHTML =""
        for (let i = 0; i < array.length; i++) {

            console.log(array.length)
            container_glucemia2.innerHTML += ` <tr class=${color_row(array[i].valor)}>
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
            let reload = document.getElementById("oculto")
            reload.style.display = "block";
            button_Buscador.style.display = "none";

                reload.addEventListener("click", ()=>{
                    location.reload()
                })

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
        function orden(array) {
            console.log(array.result1);
            console.log(array.result2);
        
            const result1 = array.result1 || [];
            const result2 = array.result2 || [];
        
            // Conjunto para almacenar los ids ya procesados
            const processedIds = new Set();
         
            // Iterar sobre cada elemento de result1
            for (let i = 0; i < result1.length; i++) {
                const glucemia = result1[i];
                container_glucemia2.innerHTML += ` <tr class=${color_row(glucemia.valor)}>
                    <td>${glucemia.fechaString}</td>
                    <td>${glucemia.hora}</td>
                    <td>${glucemia.valor}</td>
                    <td>${glucemia.momento === "Pre Desayuno" ? "Ayunas" : glucemia.momento}</td>
                    <td>${glucemia.notas}</td>
                </tr>`;
        
                let found = false;  
        
                
                for (let j = 0; j < result2.length; j++) {
                    if (result1[i].fechaString.trim() === result2[j].fechaString.trim() && !processedIds.has(result2[j].id)) {
                        // Si la fecha coincide y el id no ha sido procesado
                        container_insulina2.innerHTML += ` <tr>
                            <td>${result2[j].fechaString}</td>
                            <td>${result2[j].hora}</td>
                            <td>${result2[j].unidades}</td>
                            <td>${result2[j].tipo}</td>
                            <td>${result2[j].momento === "Pre Desayuno" ? "Ayunas" : result2[j].momento}</td>
                            <td>${result2[j].notas}</td>        
                        </tr>`;
        
                        // Marcar este id como procesado
                        processedIds.add(result2[j].id);
        
                        found = true;  // Si encontramos una coincidencia, marcamos que sí
                        break;  
                    }
                }
        
                
                if (!found) {
                    container_insulina2.innerHTML += ` <tr>
                        <td>SIN DATOS</td>
                        <td>------</td>
                        <td>------</td>
                        <td>------</td>
                        <td>------</td>
                        <td>------</td>        
                    </tr>`;
                }
            }
        }

        async function loadPage(fechaInicio, fechaFinal) {
            const data = await getValores(fechaInicio, fechaFinal)
            if (data) {
                
                console.log("Datos obtenidos:", data);
                orden(data);
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

