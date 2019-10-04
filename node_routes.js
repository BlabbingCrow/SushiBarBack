module.exports = function(app, db) {
    app.get('/testdb', async (req, res) => {
        res.send(`DB url ${process.env.DATABASE_URL}`);
    }),
    app.get('/goods', async (req, res) => {
        let sushi = await db.Models.Sushi.find();
        res.send(sushi);
    });
    app.post('/goods/create', async (req, res) => {
        await db.Models.Sushi.create({
            name: req.body.name,
            description: req.body.description,
            price: parseInt(req.body.price),
        });
        res.send('Created');
    });
    app.post('/goods/update', async (req, res) => {
        await db.Models.Sushi.update({
            name: req.body.name,
            description: req.body.description,
            price: parseInt(req.body.price),
        }, {
            where: {
                id: parseInt(req.body.id),
            } 
        });
        res.send('Updated');
    });
    app.post('/goods/delete', async (req, res) => {
        await db.Models.Sushi.destroy({
            where: {
                id: parseInt(req.body.id),
            } 
        });
        res.send('Deleted');
    });
};