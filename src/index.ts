import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/health", (req, res) => {
  res.json({ state: "ok" });
});

app.listen(port, () => {
  console.log(`Service is runing on http://localhost:${port}`);
});
