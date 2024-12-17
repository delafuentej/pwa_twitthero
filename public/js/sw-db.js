//Utils to save PouchDB

//creata a instance db

const db = new PouchDB("posts");

function saveMessage(message) {

  message._id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  //register the message in the db
  return db.put(message).then(() => {
    //to register asynchronous task => tell to the SW that
    //something is pending update when the internet connection
    //is available again.
    self.registration.sync.register("new-message");

    //to indicate offline recording =>
    const newRes = { ok: true, offline: true };
    // send this info to frontend:
    console.log("Message was saved for later posting");
    return new Response(JSON.stringify(newRes));
    //
  });
}

function postingMessages() {
  const postingArr = [];
  //1. sweep all the documents we have in the local database
  return db.allDocs({ include_docs: true }).then((docs) => {
    docs.rows.forEach((row) => {
      const doc = row.doc;

      const fetchPromise = fetch(`api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doc),
      }).then((res) => {
        //if the post has been made successfully,
        //the record must be deleted from the database.
        return db.remove(doc);
      });
      postingArr.push(fetchPromise);
    }); // fetch ending- forEach

    return Promise.all(postingArr);
  });
}
