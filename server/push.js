const fs = require('fs');
const urlsafeBase64 = require("urlsafe-base64");
const vapid = require("./vapid.json");
const webpush = require('web-push');
require("dotenv").config();


// VAPID keys config ==>  should be generated only once.
webpush.setVapidDetails(
  `mailto:${process.env.VAPID_KEYS_CONFIG_EMAIL}`,
  vapid.publicKey,
  vapid.privateKey
);

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
};

module.exports.sendPush = (post) => {
  //sent push message to all suscriptions
  subscriptions.forEach((subscription, i) =>{
    webpush.sendNotification(subscription, post.title);
  })
}