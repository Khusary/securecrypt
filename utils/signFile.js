const crypto = require("crypto");
const fs = require("fs");

const privateKey = fs.readFileSync("keys/private.pem", "utf8");

function signFile(filePath) {

    const fileBuffer = fs.readFileSync(filePath);

    const signer = crypto.createSign("RSA-SHA256");

    signer.update(fileBuffer);

    signer.end();

    return signer.sign(privateKey, "base64");
}

module.exports = signFile;