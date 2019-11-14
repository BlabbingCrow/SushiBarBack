let jwt = require('jsonwebtoken');
const secretKey = "myTestSecretKey";

module.exports = function(app, db) {
    app.use(function(req, res, next) {
        if (process.env.DATABASE_URL) {
            res.header("Access-Control-Allow-Origin", "https://sushibar.herokuapp.com");
        }
        else {
            res.header("Access-Control-Allow-Origin", "http://localhost:4200");
        }
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

        if (['/goods', '/goods/create', '/goods/update', '/goods/delete'].includes(req.originalUrl)) {
            let object = convertToObj(req.body);
            if (req.originalUrl === '/goods' && object.pageName !== "admin") {
                return next();
            }
            jwt.verify(object.token, secretKey, async function(err, decoded) {
                if (err) return res.send(false);
                if (!decoded.isAdmin) return res.send(false);
                next();
            });
        }
        else {
            next();
        }
    });
    app.get('/testdb', async (req, res) => {
        res.send(`DB url ${process.env.DATABASE_URL}`);
    });

    app.post('/login', async (req, res) => {
        let object = convertToObj(req.body);
        let user = await db.Models.User.findOne({
            where: {
                login: object.login,
                password: object.password
            }
        });
        if (user != null) {
            user.token = jwt.sign({ login: object.login, isAdmin: user.isAdmin }, secretKey);
            await user.save();
            res.send({
                login: user.login,
                isAdmin: user.isAdmin,
                token: user.token
            });
        }
        else {
            res.send(false);
        }
    });
    app.post('/register', async (req, res) => {
        let object = convertToObj(req.body);
        
        let user = await db.Models.User.findOne({
            where: {
                login: object.login
            }
        });
        if (user == null) {
            let newUser = await db.Models.User.create({
                login: object.login,
                password: object.password,
                isAdmin: false,
                token: jwt.sign({
                    login: object.login,
                    isAdmin: false
                }, secretKey)
            });
            res.send({
                login: newUser.login,
                isAdmin: newUser.isAdmin,
                token: newUser.token
            });
            
        }
        else {
            res.send(false);
        }
    });

    app.post('/goods', async (req, res) => {
        let products = await db.Models.Sushi.findAll();
        res.send(products);
    });
    
    app.post('/goods/create', async (req, res) => {
        let object = convertToObj(req.body);
        object = object.data;
        let price = parseInt(object.price);
        if (object.name == null || object.description == null || isNaN(price) || object.url == null) return res.send(false);
        let product = await db.Models.Sushi.create({
            name: object.name,
            description: object.description,
            price: price,
            url: object.url,
        });
        res.send(product);
    });
    app.post('/goods/update', async (req, res) => {
        let object = convertToObj(req.body);
        object = object.data;
        let id = parseInt(object.id);
        let price = parseInt(object.price);
        if (isNaN(id) || object.name == null || object.description == null || isNaN(price) || object.url == null) return res.send(false);
        let product = await db.Models.Sushi.update({
            name: object.name,
            description: object.description,
            price: price,
            url: object.url,
        }, {
            where: {
                id: id,
            }
        });
        res.send(object);
    });
    app.post('/goods/delete', async (req, res) => {
        let object = convertToObj(req.body);
        object = object.data;
        let id = parseInt(object.id);
        if (isNaN(id)) return res.send(false);
        await db.Models.Sushi.destroy({
            where: {
                id: id,
            }
        });
        res.send(true);
    });
};

let convertToObj = function(obj) {
    for (const key in obj) {
        return JSON.parse(key);
    }
};