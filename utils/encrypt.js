const crypto = require("crypto");
const fs = require("fs");

function encryptFile(inputFile, outputFile) {

    return new Promise((resolve, reject) => {

        const key = crypto.randomBytes(32);

        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(
            "aes-256-cbc",
            key,
            iv
        );

        const input = fs.createReadStream(inputFile);
        const output = fs.createWriteStream(outputFile);

        output.write(iv);

        input
            .pipe(cipher)
            .pipe(output);

        output.on("finish", () => {

            resolve(key);

        });

        output.on("error", reject);

        input.on("error", reject);

    });

}

module.exports = encryptFile;