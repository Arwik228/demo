const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.MYSQL_DB || 'demo',
    process.env.MYSQL_USERNAME || 'root',
    process.env.MYSQL_PASSWORD || '',
    {
        host: process.env.MYSQL_SERVER || 'localhost',
        dialect: 'mysql'
    }
);

const List = sequelize.define('list', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    text: {
        type: Sequelize.STRING(254),
        allowNull: false
    },
    path: {
        type: Sequelize.STRING(254),
        allowNull: false
    },
});

function all(req, res) {
    List.findAll().then(function (results) {
        let finalyData = [];
        results = results.sort(function (arg1, arg2) {
            return (arg1.dataValues.path === "root" ? 1 :
                (arg1.dataValues.path.split("/").length) - (arg2.dataValues.path === "root") ? 1 :
                    arg2.dataValues.path.split("/").length);
        });
        results.forEach(element => {
            if (element.dataValues.path === "root") {
                finalyData.push([element.dataValues.id, element.dataValues.text, element.dataValues.path]);
            } else {
                finalyData.forEach((e, i) => {
                    if (String(e[0]) === element.dataValues.path.split("/").pop()) {
                        finalyData.splice(i + 1, 0, [element.dataValues.id, element.dataValues.text, element.dataValues.path]);
                    }
                });
            }
        });
        if (req.swagger) {
            res.json({array: JSON.stringify(finalyData)});
        } else {
            res.render("index", {array: finalyData});
        }
    });
}

function create(req, res) {
    let path = Buffer.from(req.swagger.params.path.value, 'base64').toString() || '/';
    let content = req.swagger.params.content.value || false;
    if (path && content) {
        List.findAll({where: {text: content}}).then(function (results) {
            if (!results.length) {
                List.create({text: content, path: path}).then(function (result) {
                    res.json({response: {status: "ok", id: result.dataValues.id}});
                });
            } else {
                res.json({response: {status: "error", info: "this name unit is registration"}});
            }
        });
    } else {
        res.json({response: {status: "error", info: "bad include data"}});
    }
}

function change(req, res) {
    let id = Number.parseInt(req.swagger.params.id.value) || false;
    let content = req.swagger.params.content.value || false;
    if (Number.isInteger(id) && content) {
        List.findAll({where: {text: content}}).then(function (results) {
            if (!results.length) {
                List.findOne({where: {id: id}}).then(function (data) {
                    if (data) {
                        data.update({text: content}).then(function () {
                            res.json({response: {status: "ok"}});
                        });
                    }
                });
            } else {
                res.json({response: {status: "error", info: "this name unit is registration"}});
            }
        });
    } else {
        res.json({response: {status: "error", info: "bad include data"}});
    }
}

function remove(req, res) {
    let id = req.swagger.params.ids.value || false;
    if (id) {
        Buffer.from(id, 'base64').toString().split(',').forEach(element => {
            List.destroy({where: {id: parseInt(element)}});
        });
        res.json({response: {status: "ok"}});
    } else {
        res.json({response: {status: "error", info: "bad include data"}});
    }
}

module.exports = {create, change, remove, all};


