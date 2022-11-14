const { KeyPair } = require("near-api-js");

const generateKeyPair = () => {
    const keyPair = KeyPair.fromRandom("ed25519");
    return keyPair;
};

module.exports = {
    generateKeyPair,
};
