module.exports = (db) => {
    const WebSocket = require('ws');
    const wss = new WebSocket.Server({
        port: 3002,
        perMessageDeflate: {
            zlibDeflateOptions: {
                chunkSize: 1024,
                memLevel: 7,
                level: 3
            },
            zlibInflateOptions: {
                chunkSize: 10 * 1024
            },
            clientNoContextTakeover: true,
            serverNoContextTakeover: true,
            serverMaxWindowBits: 10,
            concurrencyLimit: 10,
            threshold: 1024
        }
    });
    updateProducts(wss);
    setInterval(() => {
        updateProducts(wss);
    }, 5000)
};

let updateProducts = (wss) => {
    wss.clients.forEach(async client => {
        let products = await db.Models.Sushi.findAll();
        client.send(JSON.stringify(products));
    });
};