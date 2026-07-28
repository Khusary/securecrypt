const crypto = require("crypto");
const { publicKey } = require("./keyManager");

function encryptAESKey(aesKey) {

    return crypto.publicEncrypt(publicKey, aesKey);

}

module.exports = encryptAESKey;