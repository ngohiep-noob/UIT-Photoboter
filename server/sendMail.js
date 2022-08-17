const nodemailer = require('nodemailer')

const CLIENT_ID = '994472151415-rogh223q0omla41htflh2ajbfnnlj7lt.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REFRESH_TOKEN = '1//04qoYyrzBXtqPCgYIARAAGAQSNwF-L9IrpAF-bUFWVMLbxn1E-vwmisIBF-8TMke6WS0tR4u8xHmD_MGegzblVpgHGZneHWjYl3E'
const ACCESS_TOKEN = 'ya29.A0AVA9y1sRveyTUP_UDMZUFdZQ0K83qyvC8CYJ2A0iR1WJ-fws1PFkreeu-lIA95vRdGseR1dfAu3oh3i3GpeaXOKWYuFGuFoHmtwuKPzHsgia91LLZVrf51XrV-fdmDSmXprssWaEgyZGycCJLUXw5FgSRuROaCgYKATASATASFQE65dr8Oms3ktJSkT7ifiPG0t6iiA0163'

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