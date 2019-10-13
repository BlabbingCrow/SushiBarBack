module.exports = function(app, db) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:4200");
        //res.header("Access-Control-Allow-Origin", "https://sushibar.herokuapp.com");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }),
    app.get('/testdb', async (req, res) => {
        res.send(`DB url ${process.env.DATABASE_URL}`);
    }),
    app.get('/goods', async (req, res) => {
        let products = await db.Models.Sushi.findAll();
        res.send(products);
    });
    app.post('/goods/create', async (req, res) => {
        let object = convertToObj(req.body);
        
        let price = parseInt(object.price);
        if (object.name == null || object.description == null || isNaN(price)) return res.send(false);
        let product = await db.Models.Sushi.create({
            name: object.name,
            description: object.description,
            price: price,
            url: object.url,
        });
        res.send(product);
    });
    app.post('/goods/update', async (req, res) => {
        if (req.body.name == null || req.body.description == null || isNaN(parseInt(req.body.price))) return res.send(false);
        let product = await db.Models.Sushi.update({
            name: req.body.name,
            description: req.body.description,
            price: parseInt(req.body.price),
            url: req.body.url,
        }, {
            where: {
                id: parseInt(req.body.id),
            } 
        });
        res.send(true);
    });
    app.post('/goods/delete', async (req, res) => {
        if (isNaN(parseInt(req.body.id))) return res.send(false);
        await db.Models.Sushi.destroy({
            where: {
                id: parseInt(req.body.id),
            } 
        });
        res.send(true);
    });
};

let convertToObj = function(obj) {
    for (const key in obj) {
        return JSON.parse(key);
    }
}