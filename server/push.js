const urlsafeBase64 = require("urlsafe-base64");
const vapid = require("./vapid.json");

module.exports.getKey = () => {
  console.log('keyWWW', urlsafeBase64.decode(vapid.publicKey))
  return urlsafeBase64.decode(vapid.publicKey);
};
