const mysql = require('mysql');

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  database: "demo",
  password: ""
});

connection.connect(function (err) {
  if (err) {
    console.error(`Ошибка: ${err.message}`);
  } else {
    console.log("Подключение к серверу MySQL успешно установлено");
  }
});

function all(req, res) {
  connection.query(`SELECT * FROM list`, function (error, results, fields) {
    if (error) throw error;
    let finalyData = new Array();
    results = results.sort(function (arg1, arg2) { return (arg1.Path == "root" ? 1 : arg1.Path.split("/").length) - (arg2.Path == "root" ? 1 : arg2.Path.split("/").length) });
    results.forEach(element => {
      if (element.Path == "root") {
        finalyData.push([element.UnitID, element.Text, element.Path]);
      } else {
        finalyData.forEach((e, i) => {
          if (e[0] == element.Path.split("/").pop()) {
            finalyData.splice(i + 1, 0, [element.UnitID, element.Text, element.Path]);
          }
        });
      }
    });
    res.render("index", { array: finalyData });
  });
}

function create(req, res) {
  let path = Buffer.from(req.swagger.params.path.value, 'base64').toString() || '/';
  let content = req.swagger.params.content.value || false;
  let data = Number.parseInt(Date.now() / 1000).toString();
  if (path && content) {
    connection.query(`SELECT * FROM list WHERE Text = ?`, content, function (error, results, fields) {
      if (!results[0]) {
        connection.query(`INSERT INTO list (Text, Data, Path) VALUES(?,?,?)`, [content, data, path], function (error, results, fields) {
          if (error) throw error;
          res.json({ response: { status: "ok", id: results.insertId } });
        });
      } else {
        res.json({ response: { status: "error", info: "this name unit is registration" } });
      }
    });
  } else {
    res.json({ response: { status: "error", info: "bad include data" } });
  }
}

function change(req, res) {
  let id = Number.parseInt(req.swagger.params.id.value) || false;
  let content = req.swagger.params.content.value || false;
  if (Number.isInteger(id) && content) {
    connection.query(`SELECT * FROM list WHERE Text = ?`, content, function (error, results, fields) {
      if (!results[0]) {
        connection.query(`UPDATE list SET Text = ? WHERE UnitID = ?`, [content, id], function (error, results, fields) {
          if (error) throw error;
          res.json({ response: { status: "ok" } });
        });
      } else {
        res.json({ response: { status: "error", info: "this name unit is registration" } });
      }
    });
  } else {
    res.json({ response: { status: "error", info: "bad include data" } });
  }
}

function remove(req, res) {
  let id = req.swagger.params.ids.value || false;
  if (id) {
    Buffer.from(id, 'base64').toString().split(',').forEach(element => {
      connection.query(`DELETE FROM list WHERE UnitID = ?`, parseInt(element), function (error, results, fields) {
        if (error) throw error;
      });
    });
    res.json({ response: { status: "ok" } });
  } else {
    res.json({ response: { status: "error", info: "bad include data" } });
  }
}


module.exports = { create, change, remove, all };


