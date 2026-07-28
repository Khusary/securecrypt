const crypto = require("crypto");
const fs = require("fs");

const { privateKey } = require("./keyManager");

function decryptAESKey(encryptedKeyPath) {

    const encryptedKey = fs.readFileSync(encryptedKeyPath);

    const aesKey = crypto.privateDecrypt(privateKey, encryptedKey);

    return aesKey;
}

module.exports = decryptAESKey;