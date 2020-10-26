const Sequelize = require('sequelize');
const pug = require('pug');

const sequelize = new Sequelize(
  'demo', 'root', '', {
  host: process.env.HOSTNAME || 'localhost',
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

sequelize.authenticate().then(function (err) {
  console.log('Connection has been established successfully.');
}).catch(function (err) {
  console.log('Unable to connect to the database:', err);
});

getAllElements = async () => {
  results = await List.findAll();
  let finalyData = [];
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
  return finalyData;
}

exports.apiElementContentPOST = async function (content = false, body) {
  let path = Buffer.from(body.path, 'base64').toString() || '/';
  if (path && content) {
    let results = await List.findAll({ where: { text: content } });
    if (!results.length) {
      let result = await List.create({ text: content, path: path });
      return { response: { status: "ok", id: result.dataValues.id } };
    } else {
      return { response: { status: "error", info: "this name unit is registration" } };
    }
  } else {
    return { response: { status: "error", info: "bad include data" } };
  }
}

exports.apiElementContentPUT = async function (content = false, body) {
  let id = Number.parseInt(body.id) || false;
  if (Number.isInteger(id) && content) {
    let results = await List.findAll({ where: { text: content } });
    if (!results.length) {
      let data = await List.findOne({ where: { id } });
      if (data) {
        await data.update({ text: content });
        return ({ response: { status: "ok" } });
      }
    } else {
      return ({ response: { status: "error", info: "this name unit is registration" } });
    }
  } else {
    return ({ response: { status: "error", info: "bad include data" } });
  }
}

exports.apiElementDeleteIdsDELETE = async function (body) {
  if (body.ids || false) {
    Buffer.from(body.ids, 'base64').toString().split(',').forEach(element => {
      List.destroy({ where: { id: parseInt(element) } });
    });
    return ({ response: { status: "ok" } });
  } else {
    return ({ response: { status: "error", info: "bad include data" } });
  }
}

exports.apiElementsGET = async function () {
  return JSON.stringify(await getAllElements());
}

exports.index = async function (res) {
  let content = pug.renderFile('./app/templates/index.pug', { array: await getAllElements() })
  res.setHeader('Content-Type', 'text/html');
  res.end(content);
}

exports.getAllElements = getAllElements;

