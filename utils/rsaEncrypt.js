const crypto = require("crypto");
const fs = require("fs");

function encryptAESKey(aesKey) {
  const publicKey = fs.readFileSync("./keys/public.pem", "utf8");

  const encryptedKey = crypto.publicEncrypt(publicKey, aesKey);

  return encryptedKey;
}

module.exports = encryptAESKey;