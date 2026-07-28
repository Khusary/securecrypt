const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const keysDir = path.join(__dirname, "../keys");
const privateKeyPath = path.join(keysDir, "private.pem");
const publicKeyPath = path.join(keysDir, "public.pem");

if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
}

if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: "spki",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem"
        }
    });

    fs.writeFileSync(publicKeyPath, publicKey);
    fs.writeFileSync(privateKeyPath, privateKey);

    console.log("RSA Keys generated successfully.");
}

module.exports = {
    privateKey: fs.readFileSync(privateKeyPath, "utf8"),
    publicKey: fs.readFileSync(publicKeyPath, "utf8")
};