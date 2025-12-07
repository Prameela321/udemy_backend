import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import app from "./app.js";
import connectDB from "./config/connection.js";

const port = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.get("/test", (req, res) => {
  res.send("Test CI/CD is running!");
});
