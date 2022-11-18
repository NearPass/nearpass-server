const express = require("express");
const { connect, Contract } = require("near-api-js");
const getConfig = require("./config");
const { generateKeyPair } = require("./utils");
var cors = require("cors");
const { UnencryptedFileSystemKeyStore } = require("near-api-js/lib/key_stores");

let keyStore;
let near;

const EVENTS_CONTRACT_ADDRESS = "dev-1668157708044-69561609686629";

async function init() {
    const nearConfig = getConfig("testnet");
    keyStore = new UnencryptedFileSystemKeyStore("./keyStore");
    near = await connect({ keyStore, ...nearConfig });
}

const isKeyAdded = async (near, accountId, publicKey) => {
    const account = await near.account(accountId);
    const keys = await account.getAccessKeys();
    let result = keys.filter((key) => {
        return key.public_key == publicKey;
    });
    return result ? 1 : 0;
};

// const eventsContractInstance = (account) => {
//     const eventsContract = new Contract(account, EVENTS_CONTRACT_ADDRESS, {
//         changeMethods: ["redeem"],
//     });
//     return eventsContract;
// };

const redeemCall = async (eventsContract, ticketId) => {
    const tx = await eventsContract.redeem({
        args: {
            ticketId,
        },
    });

    return tx;
};

const app = express();
app.use(express.json());

app.get("/connectwallet", async (req, res, next) => {
    let { accountId } = req.query;

    let key = await near.config.keyStore.getKey("testnet", accountId);

    if (key) {
        let public_key = key.getPublicKey();
        if (isKeyAdded(near, accountId, public_key)) {
            return res.status(200).json({
                connected: true,
            });
        }
    }

    let keyPair = generateKeyPair();
    let public_key = keyPair.getPublicKey().toString();
    await near.config.keyStore.setKey("testnet", accountId, keyPair);

    let url = new URL("https://wallet.testnet.near.org/login");
    url.searchParams.set("public_key", public_key);
    url.searchParams.set("contract_id", EVENTS_CONTRACT_ADDRESS);
    url.searchParams.append("methodNames", "createEvent");
    url.searchParams.append("methodNames", "redeem");

    res.status(200).json({
        sign_in_link: url,
    });
});

app.get("/redeem", async (req, res, next) => {
    let { accountId, ticketId } = req.query;
    let account = await near.account(accountId);
    let tx = await account.functionCall({
        contractId: EVENTS_CONTRACT_ADDRESS,
        methodName: "redeem",
        args: {
            ticketId: ticketId.replace("/", ""),
        },
    });
    return res.status(200).json({
        data: tx,
    });
});

init();
app.listen(process.env.PORT);
