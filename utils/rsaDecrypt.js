const crypto = require("crypto");
const fs = require("fs");

function decryptAESKey(encryptedKeyPath) {
  const privateKey = fs.readFileSync("./keys/private.pem", "utf8");

  const encryptedKey = fs.readFileSync(encryptedKeyPath);

  const aesKey = crypto.privateDecrypt(privateKey, encryptedKey);

  return aesKey;
}

module.exports = decryptAESKey;
