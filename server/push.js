const fs = require('fs');

const urlsafeBase64 = require("urlsafe-base64");
const vapid = require("./vapid.json");

//to maintain subscriptions when upgrading the browser
//const subscriptions = [];
const subscriptions = require('./subscriptions-db.json');

module.exports.getKey = () => {
  console.log('keyWWW', urlsafeBase64.decode(vapid.publicKey))
  return urlsafeBase64.decode(vapid.publicKey);
};

module.exports.addSubscription = (subscription) => {

    subscriptions.push(subscription);

    fs.writeFileSync(`${__dirname}/subscriptions-db.json`, JSON.stringify(subscriptions))
    console.log('subscriptions',subscriptions);
}