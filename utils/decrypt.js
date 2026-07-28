const crypto = require("crypto");
const fs = require("fs");

function decryptFile(encryptedFile, outputFile, aesKey) {

  return new Promise((resolve, reject) => {

    try {

      // Read IV
      const iv = Buffer.alloc(16);

      const fd = fs.openSync(encryptedFile, "r");

      fs.readSync(fd, iv, 0, 16, 0);

      fs.closeSync(fd);

      // Create decipher
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        aesKey,
        iv
      );

      // Streams
      const input = fs.createReadStream(encryptedFile, {
        start: 16,
      });

      const output = fs.createWriteStream(outputFile);

      // Error handling
      input.on("error", reject);

      output.on("error", reject);

      decipher.on("error", reject);

      // Resolve only after writing is complete
      output.on("finish", () => {
        resolve();
      });

      input
        .pipe(decipher)
        .pipe(output);

    } catch (error) {

      reject(error);

    }

  });

}

module.exports = decryptFile;