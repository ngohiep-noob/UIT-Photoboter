const express = require("express");
const path = require("path");
const app = express();
const SendMail = require('./server/sendMail')
const cors = require('cors')

app.use(cors())
app.use(express.json({limit: '50mb'}));

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.post('/send-mail', async (req, res) => { 
  try {
    const {recipient, imgBase64, title} = req.body;
    const sendMailResp = await SendMail(recipient, imgBase64, title);
    return res.json({
      status: 'success',
      data: sendMailResp
    })
  } catch (error) {
    console.log(error);
    return res.json({
      status: 'error',
      message: error
    })
  }
})


app.post('/recognize', (req, res) => {
  setTimeout(() => {
    return res.json({
      status: 'ok'
    })
  }, 1000)
})

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running on: http://localhost:3000");
});
