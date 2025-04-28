const connection = require("../config/db");

const getHomepage = (req, res) => {
  // A simple SELECT query
  // connection.query("SELECT * FROM Categories", function (err, results, fields) {
  //   list = results;
  //   console.log(">>> results= ", results);
  //   res.send(JSON.stringify(results));
  // });
  res.send("Hello World!");
};

const getTduc = (req, res) => {
  res.render("sample.ejs");
};

const createUser = (req, res) => {
  let { name, email, password, role, phone_number, address } = req.body;

  connection.query(
    `INSERT INTO users (name, email, password, role, phone_number, address) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email, password, role, phone_number, address],
    function (err, results) {
      if (err) {
        console.error(err);
        return res.status(500).send("Error creating user");
      }
      console.log(results);
      res.send("Created user succeed!!!");
    }
  );
};

module.exports = {
  getHomepage,
  getTduc,
  createUser,
};
