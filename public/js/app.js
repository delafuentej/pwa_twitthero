
var url = window.location.href;
var swLocation = "/twittor/sw.js";
var swRegister;

if (navigator.serviceWorker) {
  if (url.includes("localhost")) {
    swLocation = "/sw.js";
  }

  //to make the sw registration when the web page is already loaded

  window.addEventListener("load", function () {
    //when the sw handles the subscription of notifications,
    //it is necessary to work with the same sw registry
    navigator.serviceWorker
      .register(swLocation)
      .then(function (reg) {
        swRegister = reg;
        //once the web browser is loaded, check that you are subscribed to the notifications:
        swRegister.pushManager.getSubscription().then(checkSubscription);
        console.log("SW sucessfully registered");
      })
      .catch((error) => {
        console.log("Error SW registration", error);
      });
  });
}



var googleMapKey = null;
// to obtain the googleMapKey from .env file
fetch('/api/google-map-key')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error getting Google Map Key');
    }
    return response.json(); 
  })
  .then(data => {
    googleMapKey = data.key;
    //console.log('Google Map Key:', googleMapKey);
  })
  .catch(error => {
    console.error('Error:', error);
  });


if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('El navegador admite Service Workers y Push API.');
} else {
  console.error('El navegador no admite notificaciones push.');
}



// References de jQuery
var titulo = $("#titulo");
var nuevoBtn = $("#nuevo-btn");
var salirBtn = $("#salir-btn");
var cancelarBtn = $("#cancel-btn");
var postBtn = $("#post-btn");
var avatarSel = $("#seleccion");
var timeline = $("#timeline");

var modal = $("#modal");
var modalAvatar = $("#modal-avatar");
var avatarBtns = $(".seleccion-avatar");
var txtMensaje = $("#txtMensaje");

var btnNotifyActivated = $(".btn-noti-activadas");
var btnNotifyDeactivated = $(".btn-noti-desactivadas");


var btnLocation      = $('#location-btn');

var modalMapa        = $('.modal-mapa');

var btnTomarFoto     = $('#tomar-foto-btn');
var btnPhoto         = $('#photo-btn');
var containerCam = $('.camara-contenedor');

var lat  = null;
var lng  = null; 
var photo = null; 



// El usuario, contiene el ID del hÃ©roe seleccionado
var usuario;


//create an instance of the cam class
//document.getElementById('player');
const cam = new Cam($('#player')[0]);

//const { application } = require("express");

// ===== Codigo de la aplicaciÃ³n

function crearMensajeHTML(mensaje, personaje, lat, lng, photo) {
  var content = `
    <li class="animated fadeIn fast"
      data-tipo="mensaje"
      data-message="${mensaje}"
      data-user="${ personaje }"
      >

        <div class="avatar">
            <img src="img/avatars/${personaje}.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${personaje}</h3>
                <br/>
                ${mensaje}
           
    `;
    if(photo){
      content += `
      <br>
      <img class="foto-mensaje" src="${photo}">
      `;

    }
      content += ` </div>
            <div class="arrow"></div>
        </div>
    </li>`;
   
    // si existe la latitud y longitud, 
    // llamamos la funcion para crear el mapa
    if ( lat ) {
      crearMensajeMapa( lat, lng, personaje );
  }

    // Borramos la latitud y longitud por si las usó
    lat = null;
    lng = null;

    $('.modal-mapa').remove();

  timeline.prepend(content);
  cancelarBtn.click();
}


function crearMensajeMapa(lat, lng, personaje) {


  let content = `
  <li class="animated fadeIn fast"
      data-tipo="mapa"
      data-user="${ personaje }"
      data-lat="${ lat }"
      data-lng="${ lng }">
              <div class="avatar">
                  <img src="img/avatars/${ personaje }.jpg">
              </div>
              <div class="bubble-container">
                  <div class="bubble">
                      <iframe
                          width="100%"
                          height="250"
                          frameborder="0" style="border:0"
                          src="https://www.google.com/maps/embed/v1/view?key=${ googleMapKey }&center=${ lat },${ lng }&zoom=17" allowfullscreen>
                          </iframe>
                  </div>
                  
                  <div class="arrow"></div>
              </div>
          </li> 
  `;

  timeline.prepend(content);
}




// Globals
function logIn(ingreso) {
  if (ingreso) {
    nuevoBtn.removeClass("oculto");
    salirBtn.removeClass("oculto");
    timeline.removeClass("oculto");
    avatarSel.addClass("oculto");
    modalAvatar.attr("src", "img/avatars/" + usuario + ".jpg");
  } else {
    nuevoBtn.addClass("oculto");
    salirBtn.addClass("oculto");
    timeline.addClass("oculto");
    avatarSel.removeClass("oculto");

    titulo.text("Seleccione Personaje");
  }
}

// Hero Selection
avatarBtns.on("click", function () {
  usuario = $(this).data("user");

  titulo.text("@" + usuario);

  logIn(true);
});

// Boton de salir
salirBtn.on("click", function () {
  logIn(false);
});

// Boton de nuevo mensaje
nuevoBtn.on("click", function () {
  modal.removeClass("oculto");
  modal.animate(
    {
      marginTop: "-=1000px",
      opacity: 1,
    },
    200
  );
});

// Boton de cancelar mensaje
cancelarBtn.on("click", function () {
  if (!modal.hasClass("oculto")) {
    modal.animate(
      {
        marginTop: "+=1000px",
        opacity: 0,
      },
      200,
      function () {
        modal.addClass("oculto");
        txtMensaje.val("");
      }
    );
  }
});

const PORT = window.location.port;
console.log("xxxxx", PORT);

// Send Message Button
postBtn.on("click", function () {
  var mensaje = txtMensaje.val();
  if (mensaje.length === 0) {
    cancelarBtn.click();
    return;
  }

  var data = {
    _id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    message: mensaje,
    user: usuario,
    lat: lat,
    lng: lng,
    photo: photo,
  };
  //fetch(`http://localhost:${PORT}/api`, {
  fetch(`http://localhost:${PORT}/api`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => console.log("app.js", res))
    .catch((err) => console.log("POST app.js error", err));

  crearMensajeHTML(mensaje, usuario, lat, lng, photo);

  photo = null;
});

// to obtain messages from server
const getAllMessages = async () => {
  await fetch(`http://localhost:${PORT}/api`)
    .then((res) => res.json())
    .then((posts) => {
      console.log('posts', posts)
      posts.forEach((post) => {
        console.log('post.message',post.message)
        console.log('post.user',post.user)
        
        crearMensajeHTML(post.message, post.user, post.lat, post.lng);
      });
    });
  // console.log("messages", messages);
};

getAllMessages();

//to detect internet connection changes:
function isOnline() {
  //if the web browser has an internet connection
  if (navigator.onLine) {
    //connection
    //console.log("online");
    $.mdtoast("ONLINE", {
      type: "success",
      position: "top",
      interaction: true,
      interactionTimeout: 2000,
      actionText: "OK!",
    });
  } else {
    //no connection
    // console.log("offline");
    $.mdtoast("OFFLINE", {
      type: "error",
      position: "top",
      interaction: true,
      actionText: "OK!",
    });
  }
}

//to trigger isOnline => create listeners in window

window.addEventListener("online", isOnline);
window.addEventListener("offline", isOnline);

isOnline();

//Notifications

//check subscription

function checkSubscription(enabled) {
 // console.log('enabled', enabled)
  if (enabled) {
    btnNotifyActivated.removeClass("oculto");
    btnNotifyDeactivated.addClass("oculto");
  } else {
    btnNotifyActivated.addClass("oculto");
    btnNotifyDeactivated.removeClass("oculto");
  }
}

function sendNotification() {
  const notificationOpts = {
    body: "Notification Body",
    icon: "/img/icons/icon-72x72.png",
  };
  const notification = new Notification("Welcome!!!", notificationOpts);

  notification.onclick = () => {
    console.log("Click");
  };
}

//-function for requesting notifications
function requestingNotifications() {
  //1.Check if the web browser supports notifications
  if (!window.Notification) {
    alert("Web browser does not support notifications");
    return;
  }

  if (Notification.permission === "granted") {
    //new Notification("Notifications - granted");
    sendNotification();
  } else if (
    Notification.permission !== "denied" ||
    Notification.permission === "default"
  ) {
    Notification.requestPermission(function (permission) {
      console.log("permission", permission);

      if (permission === "granted") {
        //new Notification("Notifications - granted");
        sendNotification();
      } else {
        console.warn("Notification permits not granted");
      }
    });
  }
}

requestingNotifications();

// to get the public key
function getPublicKey() {
  
    // fetch("api/key")
    //     .then( res => res.text())
    //     then(console.log)
    return fetch('api/key')
      .then(res => res.arrayBuffer())
      .then(key => new Uint8Array(key));
     

}
//getPublicKey().then(console.log)



//start the whole subscription process when the customer
// clicks on the btn: btnNotifyDeactivated:
console.log(btnNotifyDeactivated)
btnNotifyDeactivated.on("click", function () {
  if (!swRegister) return console.log("SW has not been registered");

  // if SW has not been registered, the public key is needed
  // to create the registration in the SW:
  getPublicKey().then(function (key) {
    // const applicationServerKey = urlBase64ToUint8Array(key)
    // console.log(
    //   "swRegister",
    //   swRegister.pushManager.subscribe({
    //     userVisibleOnly: true,
    //     applicationServerKey: applicationServerKey,
    //   })
    // );
    swRegister.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: key,
      })
      .then((res) => res.toJSON())
      .then((subscription) => {
        //console.log("subscription", subscription);

        // posting subscription:  
            fetch('api/subscribe', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(subscription)
            }).then(checkSubscription)
            .catch(cancelSubscription)


       //checkSubscription(subscription);
      });
    // .catch((error) => {
    //   console.error("Error subscription XXXX", error);
    // });
  });
});

// cancel subscription from frontend

function cancelSubscription(){
  swRegister.pushManager.getSubscription().then(subscription => {
    subscription.unsubscribe().then(()=> checkSubscription(false));
  })
}

btnNotifyActivated.on('click', function(){
  cancelSubscription();
})


// Crear mapa en el modal
function showMapModal(lat, lng) {

  $('.modal-mapa').remove();
  
  var content = `
          <div class="modal-mapa">
              <iframe
                  width="100%"
                  height="250"
                  frameborder="0"
                  src="https://www.google.com/maps/embed/v1/view?key=${ googleMapKey }&center=${ lat },${ lng }&zoom=17" allowfullscreen>
                  </iframe>
          </div>
  `;

  modal.append( content );
}


// Sección 11 - Recursos Nativos


// Obtener la geolocalización
btnLocation.on('click', () => {

  $.mdtoast('Loading Coordinates...',{
    interaction:true,
    interactionTimeout:2000,
    actionText:'OK!'
  })

      // check for Geolocation support
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
            showMapModal(pos.coords.latitude, pos.coords.longitude);

            lat= pos.coords.latitude;
            lng= pos.coords.longitude;
      })
    } else {
      console.log('Geolocation is not supported for this Browser/OS.');
    }
  

});



// Boton de la camara
// usamos la funcion de fleca para prevenir
// que jQuery me cambie el valor del this
btnPhoto.on('click', () => {

  containerCam.removeClass('oculto');

  cam.turnOn();

});


//btn to take the photo
btnTomarFoto.on('click', () => {

  //to take the photo from cam
  photo = cam.takePhoto();

  cam.turnOff();

  
  // console.log('foto',photo);
});


// Share API
if(navigator.share){
  console.log("Support it!!!")
}else{
  console.log('does not suppot it')
}


timeline.on('click', 'li', function(){
  
  //obtain all the node:
  // console.log($(this));
  // console.log('data-tipo',$(this).data('tipo'));
  // console.log('data-user',$(this).data('user'));


  let type = $(this).data('tipo');
  let lat = $(this).data('lat');
  let lng =  $(this).data('lng');
  let message = $(this).data('message');
  let user = $(this).data('user');

  console.log({type, lat, lng, message, user});

  const shareOptions = {
      title: user,
      text: message,

  }

  if(type === 'mapa'){
    shareOptions.text = 'mapa',
    shareOptions.url = `https://www.google.com/maps/@${lat},${lng},${15}z`
  }

  if (navigator.share) {
    navigator.share(shareOptions)
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
  }
});
