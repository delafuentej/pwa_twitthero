// imports
//to be able to use the pouchDB in any file found in sw=> import the script library pouchDB
importScripts("https://cdn.jsdelivr.net/npm/pouchdb@9.0.0/dist/pouchdb.min.js");
importScripts("js/sw-db.js");
importScripts("js/sw-utils.js");

const STATIC_CACHE = "static-v5";
const DYNAMIC_CACHE = "dynamic-v1";
const INMUTABLE_CACHE = "inmutable-v1";

const APP_SHELL = [
  "/",
  "index.html",
  "css/style.css",
  "img/favicon.ico",
  "img/avatars/hulk.jpg",
  "img/avatars/ironman.jpg",
  "img/avatars/spiderman.jpg",
  "img/avatars/thor.jpg",
  "img/avatars/wolverine.jpg",
  "js/app.js",
  'js/cam-class.js',
  "js/sw-utils.js",
  "js/libs/plugins/mdtoast.min.css",
  "js/libs/plugins/mdtoast.min.js",
 
];

const APP_SHELL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css", // URL de tu proxy
  "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.css",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
  "https://cdn.jsdelivr.net/npm/pouchdb@9.0.0/dist/pouchdb.min.js",
];

self.addEventListener("install", (e) => {
  const cacheStatic = caches
    .open(STATIC_CACHE)
    .then((cache) => cache.addAll(APP_SHELL));

  const cacheInmutable = caches
    .open(INMUTABLE_CACHE)
    .then((cache) => cache.addAll(APP_SHELL_INMUTABLE));

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener("activate", (e) => {
  const respuesta = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC_CACHE && key.includes("static")) {
        return caches.delete(key);
      }

      if (key !== DYNAMIC_CACHE && key.includes("dynamic")) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(respuesta);
});

self.addEventListener("fetch", (e) => {
  let response;
  if (e.request.url.includes("/api")) {
    response = handleApiMessages(DYNAMIC_CACHE, e.request);
  } else {
    response = caches.match(e.request).then((res) => {
      if (res) {
        actualizaCacheStatico(STATIC_CACHE, e.request, APP_SHELL_INMUTABLE);
        return res;
      } else {
        return fetch(e.request).then((newRes) => {
          return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
        });
      }
    });
  }

  e.respondWith(response);
});

//register asynchronous tasks
self.addEventListener("sync", (e) => {
  console.log("SW: Sync");
  //to view the registered tasks=> event.tag
  if (e.tag === "new-message") {
    // posting to DB when there is connection again
    const response = postingMessages();
    e.waitUntil(response);
  }
});

// listen push notifications
self.addEventListener('push', e => {
  // console.log('event',e),
  // console.log('event.text',e.data.text())

  const data = JSON.parse(e.data.text())

  //console.log('data',data)

  const title = data.title;
  const options = {
    body: data.message,
    icon: `img/avatars/${data.user}.jpg`,
    badge: 'img/favi.ico',
    image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1ebd221d-3581-4775-8f4c-086c377bc4c3/dei490i-dba37ddf-db8f-460b-8685-a58aedad2f09.png/v1/fit/w_828,h_1242/avengers_tower_png_by_docbuffflash82_dei490i-414w-2x.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTUwMCIsInBhdGgiOiJcL2ZcLzFlYmQyMjFkLTM1ODEtNDc3NS04ZjRjLTA4NmMzNzdiYzRjM1wvZGVpNDkwaS1kYmEzN2RkZi1kYjhmLTQ2MGItODY4NS1hNThhZWRhZDJmMDkucG5nIiwid2lkdGgiOiI8PTEwMDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.VLZpR0fc541wuGTAcL1uBo5iCM6h_GC6XsBq8kZJTE8',
    vibrate: [100,200,100,200,100,200,100,200,100,100,100,100,100,200,100,200,100,200,100,200,100,100,100,100,100,200,100,200,100,200,100,200,100,100,100,100,100,100,100,100,100,100,50,50,100,800],
    openUrl: '/',
    data: {
      // url: 'https://google.com',
      url: '/',
      id: data.user,

    },
    actions:[
      {
        action: 'superman-action',
        title: 'Superman',
        icon:'img/avatars/superman.jpg',
      },
      {
        action: 'batman-action',
        title: 'Batman',
        icon:'img/avatars/batman.jpg',
      },

    ]
  };

  //
  e.waitUntil(self.registration.showNotification(title, options))
});

// when a notification is closed
self.addEventListener('notificatonclose', e => {
  console.log('Notification closed!!',e);
});

// when the user interacts with notification
self.addEventListener('notificationclick',e => {
    const notification = e.notification;
    const action = e.action;
    // console.log({notification, action})

    //clients => allTabs in the app
   const response = clients.matchAll().then(clients =>{
      let client = clients.find( c => {
        return c.visibilityState === 'visible';
      });

      if( client !== undefined){
        client.navigate(notification.data.url);
        client.focus();// active tab
      }else{
        clients.openWindow(notification.data.url);
      }

      return notification.close();
    })
    

   e.waitUntil(response);

})
