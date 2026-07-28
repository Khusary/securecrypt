const crypto = require("crypto");
const fs = require("fs");

const publicKey = fs.readFileSync("keys/public.pem", "utf8");

function verifySignature(filePath, signature) {

    const fileBuffer = fs.readFileSync(filePath);

    const verifier = crypto.createVerify("RSA-SHA256");

    verifier.update(fileBuffer);

    verifier.end();

    return verifier.verify(
        publicKey,
        signature,
        "base64"
    );

}

module.exports = verifySignature;