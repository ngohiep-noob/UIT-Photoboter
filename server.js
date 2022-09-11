const express = require("express");
const path = require("path");
const app = express();
const SendMail = require("./server/sendMail");
const cors = require("cors");
const { GetNameById } = require("./server/getNameFromID");
const fs = require("fs");

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("/photoboter", (req, res) => {
  return res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.post("/send-mail", async (req, res) => {
  try {
    const { recipient, imgBase64, title } = req.body;
    const sendMailResp = await SendMail(recipient, imgBase64, title);
    return res.json({
      status: "success",
      data: sendMailResp,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      message: error,
    });
  }
});

app.post("/get-name", async (req, res) => {
  try {
    const resp = await GetNameById(req.body.username);
    return res.json(resp);
  } catch (error) {
    // console.log(error);
    return res.json({
      status: "error",
      code: 0,
      message: error,
    });
  }
});

app.get("/banners", async (req, res) => {
  try {
    const files = fs.readdirSync(path.join(__dirname, "public", "Banners"));
    return res.json({ files });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
});

app.get("/banners/:filename", async (req, res) => {
  try {
    const filename = req.params["filename"];
    console.log(filename);
    return res.sendFile(path.join(__dirname, "public", "Banners", filename));
  } catch (error) {
    console.log(error);
    return res.json({ error });
  }
});

app.listen(3000, () => {
  console.log("server is running on: http://localhost:3000");
});
