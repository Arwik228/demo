const json = require('./api/controllers/unit_controller.js')
const SwaggerExpress = require('swagger-express-mw');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = process.env.PORT || 10010;

module.exports = app;

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.use(express.static(`${__dirname}/app/public`));

app.set('views', `${__dirname}/app/templates`);

app.set("view engine", "ejs");

app.get('/', (req, res) => {
    json.all(req, res);
});

SwaggerExpress.create({appRoot: __dirname}, function (err, swaggerExpress) {
    if (err) {
        throw err;
    }
    swaggerExpress.register(app);
    app.listen(port, () => {
        console.log('Swagger controller starting a http://127.0.0.1:' + port);
    });
}); 
