console.log("[DATABASE] db connect...");
var Sequelize = require('sequelize');
const fs = require("fs");
let path = require('path');

module.exports = {
    sequelize: null,
    Models: {},
    connect() {
        if (process.env.DATABASE_URL) {
            this.sequelize = new Sequelize(process.env.DATABASE_URL, {
                dialect:  'postgres',
                protocol: 'postgres',
                port:     match[4],
                host:     match[3],
                logging:  false
            });
        }
        else {
            this.sequelize = new Sequelize('SushiBarBack', 'postgres', null, {
                host: 'localhost',
                dialect: 'postgres'
            });
        }

        fs.readdirSync(__dirname + "/models").forEach(file => {
            console.log(`[DATABASE] --${file}`);
            let model = this.sequelize.import(__dirname + "/models/" + file);
            this.Models[model.name] = model;
        });

        for (var name in this.Models) {
            let model = this.Models[name];
            if (model.associate) model.associate(this.Models);
        }

        this.sequelize.sync();
        console.log("[DATABASE] loaded.");
    }
}
