const obtenerComentarios = (carpeta) => {
  // Preparamos algunos valores auxiliares de la conexión ajax
  let url = "/api/comentariosporarticulo.php";
  let queryString = "";
  queryString += "?carpeta=" + carpeta;
  queryString += "&articulo=" + window.location.href;
  url += queryString;
  moment.locale('es-AR')

  const config = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  // Efectuamos la comunicación vía AJAX
  // El resultado es procesado en el método 'then'
  const listaDeComentarios = document.getElementById("lista");
  // eliminar los renglones existentes, si hay alguno
  while (listaDeComentarios.firstChild) {
    listaDeComentarios.removeChild(listaDeComentarios.lastChild);
  }
  // () => {}
  const temp = document.getElementById("plantilla-comentarios");
  const item = temp.content.querySelector("div.com-fila-plantilla");
  fetch(url, config)
    .then(res => res.json())
    .catch((error) => console.error("Error:", error))
    .then(comentarios => {
      comentarios = R.reverse(comentarios);
      comentarios.forEach(element => {
        const fecha = moment(element.fecha_recibido*1000).fromNow();
        const nuevoRegistro = document.importNode(item, true);
        nuevoRegistro.querySelector("span.com-usuario-plantilla").innerText = element.nick;
        nuevoRegistro.querySelector("span.com-fecha-plantilla").innerText = fecha;
        nuevoRegistro.querySelector("div.com-texto").innerText = element.texto;
        listaDeComentarios.appendChild(nuevoRegistro);
      });
    });
};

const guardarContacto = () => {
  document.getElementById('botonOk').style.disabled=true;
  // Función para borrar el formulario una vez enviado
  const reiniciarFormulario = () => {
    document.getElementById("nombre").value = "";
    document.getElementById("correo").value = "";
    //document.getElementById('asunto' ).value ="";
    document.getElementById("mensaje").value = "";
  };

  // Obtenemos los valores que ingresó el usuario
  const nombre = document.getElementsByName("nombre")[0].value;
  const correo = document.getElementsByName("correo")[0].value;
  //const asunto  = document.getElementsByName('asunto' )[0].value;
  const mensaje = document.getElementsByName("mensaje")[0].value;

  // Preparamos algunos valores auxiliares de la conexión ajax
  const url = "/api/guardarcontacto.php";
  const argumentos = { nombre, correo, asunto: "Comentario", mensaje };
  const config = {
    method: "POST",
    body: JSON.stringify(argumentos),
    headers: { "Content-Type": "application/json" },
  };

  // Efectuamos la comunicación vía AJAX
  // El resultado es procesado en el método 'then'
  fetch(url, config)
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then(() => {
      // Reaccionamos ante la finalización de la comunicación AJAX
      alert("¡Muchas gracias por comentar!");
      document.getElementById('botonOk').style.disabled=false;
      reiniciarFormulario();
    });
};

obtenerComentarios(2);
