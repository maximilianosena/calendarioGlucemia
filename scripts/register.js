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
                    console.log(user)
                    (console.log(user_alias))
                    email_bienvenida(user, user_alias)
                 
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

async function email_bienvenida(email, alias) {

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
    const response = await fetch('https://backend-glucemia.vercel.app/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, subject, message })
    });
    
    const result = await response.json();
    if (result.success) {
        alert('Email enviado!');
    } else {
        alert('Error al enviar el email');
    }
}

