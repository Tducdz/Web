require("dotenv").config(); // NÊN đặt dòng này lên đầu tiên

const express = require("express");
const app = express();
const db = require("./config/db");
const cors = require("cors"); // Thêm dòng này để import cors

app.use(cors()); // Thêm dòng này để sử dụng cors (cho phép tất cả các nguồn gốc)
app.use(express.json()); // Middleware để parse JSON

// Routes
const user = require("./routes/user");
app.use("/users", user);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server chạy ở cổng ${PORT}`);
});
