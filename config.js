function getConfig(env) {
    switch (env) {
        case "mainnet":
            return {
                networkId: "mainnet",
                nodeUrl: "https://rpc.mainnet.near.org",
                walletUrl: "https://wallet.near.org",
                helperUrl: "https://helper.mainnet.near.org",
            };
        // This is an example app so production is set to testnet.
        // You can move production to mainnet if that is applicable.
        case "production":
        case "development":
        case "testnet":
        default:
            return {
                networkId: "testnet",
                nodeUrl: "https://rpc.testnet.near.org",
                walletUrl: "https://wallet.testnet.near.org",
                helperUrl: "https://helper.testnet.near.org",
            };
    }
}

module.exports = getConfig;
