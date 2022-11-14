const express = require("express");
const { connect } = require("near-api-js");
const getConfig = require("./config");
const { generateKeyPair } = require("./utils");

async function init() {
    const nearConfig = getConfig("testnet");
    let near = await connect({ ...nearConfig });
}

const app = express();

app.get("/", (req, res, next) => {
    let keyPair = generateKeyPair();
    let public_key = keyPair.getPublicKey().toString();
    res.status(200).json({
        sign_in_link: `https://wallet.testnet.near.org/login?title=tgbot&public_key=${public_key}&methodNames=`,
    });
});

init();
app.listen(3000);
