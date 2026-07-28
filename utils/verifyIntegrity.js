const generateHash = require("./hashGenerator");

function verifyIntegrity(filePath, storedHash) {

    const currentHash = generateHash(filePath);

    return currentHash === storedHash;

}

module.exports = verifyIntegrity;