### NearPass Server

This server handles all requests from the [NearPass React Native App](https://github.com/NearPass/nearpass-rn-app).

Server is deployed at: [https://nearpass-server-production.up.railway.app](https://nearpass-server-production.up.railway.app)

Since, Near doesn't have a solution to connect wallet in react native I created a server that uses Unencrypted KeyStore to store the function keys for the wallet connected to the app.

This server lets mobile user connect near wallet and also lets the event manager verify tickets using phone.
