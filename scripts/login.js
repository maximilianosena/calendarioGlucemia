
document.addEventListener("DOMContentLoaded", function() {

    let input_user = document.getElementById("user")
    let input_pass = document.getElementById("pass")
    let formulario = document.getElementById("datos")
    let cartel = document.getElementById("cartel")

    formulario.addEventListener("submit", async function (e){

      if (!formulario.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        formulario.classList.add('was-validated');  // Añadir clase Bootstrap
        cartel.innerHTML +=`<div class="alert alert-warning" role="alert">Si es su primer ingreso, por favor ingrese a Nuevo Usuario</div>`
        return;
       }
         e.preventDefault();
        const user = input_user.value.trim()
        const pass = input_pass.value.trim()
        console.log('Datos enviados:', { email: user, password: pass })
        if (user!=="" && pass!=="" ){
            const obj= {email: `${user}`,
                password: `${pass}`
                }
        console.log(obj)
        try { 
            
            // Hacer una solicitud POST usando fetch
            const response = await fetch('https://backend-glucemia.vercel.app/login', {
            method: 'POST',  // Tipo de solicitud
            headers: {
            'Content-Type': 'application/json', 
            'Accept': 'application/json' 
            },
            body: JSON.stringify( obj ),  
            });
    
         if (response.ok) {
            const result = await response.json();
            console.log('Respuesta del servidor:', result);
            localStorage.setItem("token", result.token)
            localStorage.setItem("user", user)
            localStorage.setItem("id", result.id)
            location.replace(`index.html`)
          } else if (response.status===401 || response.status===400){
            input_user.classList.add("is-invalid")
            input_pass.classList.add("is-invalid")
            cartel.innerHTML +=`<div class="alert alert-warning" role="alert">Si es su primer ingreso, por favor ingrese a Nuevo Usuario</div>`
          } else {
            console.error('Error en la solicitud:', response.status);
          }
        } catch (error) {
          console.error('Error al hacer la solicitud:', error);
        }
    
    }})
    })