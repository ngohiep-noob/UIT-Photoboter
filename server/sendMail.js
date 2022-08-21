const nodemailer = require('nodemailer')

const CLIENT_ID = '994472151415-rogh223q0omla41htflh2ajbfnnlj7lt.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REFRESH_TOKEN = '1//04ZBxSFEdEs-sCgYIARAAGAQSNwF-L9Ir0bbsPLwGr8LIevvEq8mKWEK5IjibSn6GQrseTjJMPtZGvY9Y-unwlgHJB_DpDDNZHuM'
const ACCESS_TOKEN = 'ya29.A0AVA9y1uOtKulvKbevf7bxPTR8qWAsTBkcr39f6VJtdlMezRGmbhqrwhOcrykmqb9en0B30yphqUjYiQCdhw-iYK68G6Ko3FLr9ul_2VlSG_h9KRxDkz_OyEqEeYoI4C8SkiCaRc8OERQqDHH0EXxCyNWlxcHaCgYKATASATASFQE65dr8-q6v9S-wjS8HnLvHNMSktg0163'

const SendMail = async (recipient, imgBase64, title, textContent) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAUTH2',
            user: 'uit.photoboter@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: ACCESS_TOKEN
        },
    })
    
    const mailOptions = {
        from: 'UIT - Photoboter <uit.photoboter@gmail.com>',
        to: recipient,
        subject: title,
        html: `<h2>${textContent}</h2>`, // html body
        attachments: [
            {
                filename: 'image.jpeg',
                content: imgBase64.split("base64,")[1],
                encoding: 'base64',
                cid: 'selfie-image'
            }
        ]
    };

    return await transporter.sendMail(mailOptions);
}

module.exports = SendMail;