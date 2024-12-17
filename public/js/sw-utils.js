// Guardar  en el cache dinamico
function actualizaCacheDinamico(dynamicCache, req, res) {
  if (res.ok) {
    return caches.open(dynamicCache).then((cache) => {
      cache.put(req, res.clone());

      return res.clone();
    });
  } else {
    return res;
  }
}

// Cache with network update
function actualizaCacheStatico(staticCache, req, APP_SHELL_INMUTABLE) {
  if (APP_SHELL_INMUTABLE.includes(req.url)) {
    // No hace falta actualizar el inmutable
    // console.log('existe en inmutable', req.url );
  } else {
    // console.log('actualizando', req.url );
    return fetch(req).then((res) => {
      return actualizaCacheDinamico(staticCache, req, res);
    });
  }
}
//Cache Estrategy: "Network with Cache Fallback / Update"
function handleApiMessages(cacheName, req) {

  //so that all requests for these services('/api/key' |'/api/subscribe') are passed directly to the network.
  if((req.url.indexOf('/api/key') >= 0) || (req.url.indexOf('/api/subscribe') >= 0) ){
    return fetch(req);
  }else if (req.clone().method === "POST") {

        // POSTING NEW MESSAGE

    //as the “synchronization background- syncmanager” technology
    //is only supported by few browsers => a condition is needed;

    //ask if the service worker has asynchronous tasks available:
    if (self.registration.sync) {
      return req
        .clone()
        .text()
        .then((body) => {
          //it can be obtained and read the posting object
          console.log("body", body);
          const bodyObj = JSON.parse(body);

          return saveMessage(bodyObj);
        });
    } else {
      return fetch(req);
    }
  } else {
    //try to bring the most updated data
    return fetch(req)
      .then((res) => {
        if (res.ok) {
          actualizaCacheDinamico( cacheName, req, res.clone());
          return res.clone();
        } else {
          //return previous messages stored in the cache
          return caches.match(req);
        }
      })
      .catch((err) => {
        //in case of internet connection problems
        return caches.match(req);
      });
  }

}
