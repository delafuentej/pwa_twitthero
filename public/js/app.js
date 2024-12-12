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

// Referencias de jQuery

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

// El usuario, contiene el ID del hÃ©roe seleccionado
var usuario;

//const { application } = require("express");

// ===== Codigo de la aplicaciÃ³n

function crearMensajeHTML(mensaje, personaje) {
  var content = `
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${personaje}.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${personaje}</h3>
                <br/>
                ${mensaje}
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `;

  timeline.prepend(content);
  cancelarBtn.click();
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

  crearMensajeHTML(mensaje, usuario);
});

// to obtain messages from server
const getAllMessages = async () => {
  await fetch(`http://localhost:${PORT}/api`)
    .then((res) => res.json())
    .then((posts) => {
      posts.forEach((post) => {
        crearMensajeHTML(post.message, post.user);
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
  console.log('enabled', enabled)
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
            .catch(console.log)


        checkSubscription(subscription);
      });
    // .catch((error) => {
    //   console.error("Error subscription XXXX", error);
    // });
  });
});
