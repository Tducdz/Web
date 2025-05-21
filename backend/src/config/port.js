require("dotenv").config();

const connectPort = (req, res) => {
  res.set("Content-Type", "application/javascript");
  res.send(`window.API_BASE_URL = "${process.env.API_BASE_URL}";`);
};

module.exports = connectPort;
