const nodemailer = require("nodemailer");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const SendMail = async (recipient, imgBase64, title) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAUTH2",
      user: "uit.photoboter@gmail.com",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN,
    },
  });

  const mailOptions = {
    from: "UIT - Photoboter <uit.photoboter@gmail.com>",
    to: recipient,
    subject: title,
    html: `<h2>Chào bạn👋,</h2>
        <p>Đây là ảnh chụp tại Kiosk trường ĐH Công nghệ thông tin của bạn.</p>
        <p>Chúc bạn có những giây phút trải nghiệm thú vị tại UIT🥰</p>
        <p><b>UIT Photobooth Team, MMLab 👨‍💻</b></p>
        `, // html body
    attachments: [
      {
        filename: "image.jpeg",
        content: imgBase64.split("base64,")[1],
        encoding: "base64",
        cid: "selfie-image",
      },
    ],
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = SendMail;
