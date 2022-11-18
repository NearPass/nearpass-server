const { KeyPair } = require("near-api-js");

const generateKeyPair = () => {
    const keyPair = KeyPair.fromRandom("ed25519");
    return keyPair;
};

const addKeyPair = async (ctx, networkId, accountId, keyPair) => {
    const content = {
        account_id: accountId,
        public_key: keyPair.publicKey.toString(),
        private_key: keyPair.toString(),
    };
    await writeFile(
        `${__dirname}/.near-credentials/${networkId}/${ctx.from.username}_${accountId}.json`,
        JSON.stringify(content)
    );
    return content.private_key;
};

export const isKeyAdded = async (near, accountId, publicKey) => {
    const account = await near.account(accountId);
    const keys = await account.getAccessKeys();
    let result = keys.filter((key) => {
        return key.public_key == publicKey;
    });
    return result ? 1 : 0;
};

module.exports = {
    generateKeyPair,
    isKeyAdded,
};
