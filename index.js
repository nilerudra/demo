import express from "express";

const app = express();
const port = 9000;

app.use("/", (req, res) => {
  res.json({ message: "Hello from server" });
});

app.listen(port, () => {
  console.log("Starting server on port 9000");
});
