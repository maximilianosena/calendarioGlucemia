function session(){
    const token = localStorage.getItem('token')
    const name = localStorage.getItem("user")
    if (token) {
        fetch('index.html', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          if (response.status === 401) {
            window.location.href = 'login.html';
          } else {
           console.log("Hola " + name)
          }
        })
        .catch(error => console.error('Error:', error));
      } else {
        // Redirigir al usuario a la página de inicio de sesión si no hay token
        window.location.href = 'login.html';
      }

}

session()