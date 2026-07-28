const https = require("https");
const fs = require("fs");
const path = require("path");

async function downloadFromCloudinary(url, fileName) {

    console.log("Downloading encrypted file from Cloudinary...");

    return new Promise((resolve, reject) => {

        const outputPath = path.join(
            __dirname,
            "..",
            "temp",
            fileName
        );

        const file = fs.createWriteStream(outputPath);

        https.get(url, (response) => {

            response.pipe(file);

            file.on("finish", () => {

                file.close(() => {

                    resolve(outputPath);

                    console.log("Downloaded to:", outputPath);

                });

            });

        }).on("error", (err) => {

            fs.unlink(outputPath, () => { });

            reject(err);

        });

    });

}

module.exports = downloadFromCloudinary;