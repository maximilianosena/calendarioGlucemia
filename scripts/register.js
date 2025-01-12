document.addEventListener("DOMContentLoaded", function () {
    
    let input_user = document.getElementById("user")
    let input_pass = document.getElementById("pass")
    let formulario = document.getElementById("datos")
    let input_alias = document.getElementById("userAlias")
    let aviso = document.getElementById("aviso")
    formulario.addEventListener("submit", async function (e) {
      if (!formulario.checkValidity()) {
          e.preventDefault();
          e.stopPropagation();
          formulario.classList.add('was-validated');  // Añadir clase Bootstrap
          return;
      }
  
      e.preventDefault();
      const user = input_user.value.trim();
      const pass = input_pass.value.trim();
      const user_alias = input_alias.value.trim();
      
      if (user !== "" && pass !== "" && user_alias !== "") {
          const obj = {
              email: user,
              password: pass,
              alias: user_alias
          };
  
          console.log('Datos enviados:', obj);
  
          try {
                  const response = await fetch(`https://backend-glucemia.vercel.app/register`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                  },
                  body: JSON.stringify(obj),
              });
  
              console.log('Response status:', response.status);  // Verificar el estado de la respuesta
  
              if (response.ok) {
                    localStorage.setItem("alias", user_alias)
                    localStorage.setItem("email", user)
                    localStorage.setItem("primeraVez", "true")
                    location.replace("index.html")
                 
              } else if (response.status === 409) {  // 409: Conflicto (alias o email ya existen)
                const result = await response.json();  
                if (result.message.includes("Alias")) {
                    input_alias.classList.add('is-invalid');  
                    e.preventDefault();
                }
                if (result.message.includes("Email")) {
                    input_user.classList.add('is-invalid'); 
                    e.preventDefault();
                }
              } else if (response.status === 401 || response.status === 400) {
                  alert("Algo ha salido mal")
                  e.preventDefault();  // Detiene el envío del formulario
              } else {
                  console.error('Error en la solicitud:', response.status);
                  e.preventDefault();  // Detiene el envío del formulario
              }
          } catch (error) {
              console.error('Error al procesar la solicitud:', error);
              e.preventDefault();  // Detiene el envío del formulario en caso de error
          }
      }
  })

 
  input_alias.addEventListener("input", ()=>{
    input_alias.classList.contains("is-invalid")?input_alias.classList.remove("is-invalid"):null
  })
  
  input_user.addEventListener("input", ()=>{
    input_user.classList.contains("is-invalid")?input_user.classList.remove("is-invalid"):null
  })

})

let btn_close = document.getElementById("close")

btn_close.addEventListener("click", () => {
    localStorage.clear()
    location.reload()
})