const nodemailer = require('nodemailer')

const CLIENT_ID = '994472151415-rogh223q0omla41htflh2ajbfnnlj7lt.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REFRESH_TOKEN = '1//04W9QjHIhuKmICgYIARAAGAQSNwF-L9IrJPRpRVEubB4f78QHQk7cFlROZRD9NyYwEjTHjsbfMJjWYZJiASsOBWmy109Vfz7F_AI'
const ACCESS_TOKEN = 'ya29.a0AfB_byB7LAGKLfb1xEf6ytMzeMA8Ye1oc7qvLK3327voLniLQWt1sTkNx-wFIloCFyW42Tl9G9XmEpG_e1VdYSXjt2ax1QjUgovfAnLv_StaS5DN4dZ-VFFgN7yVFo9ZlLJIfrsQsTBOILhLfaIg4XxBwtG_00YU2QaCgYKAckSARESFQHsvYls0QQLFgkQ33Fs1zo2Fr9NPQ0169'

const SendMail = async (recipient, imgBase64, title) => {
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
        html: `<h2>Chào bạn👋,</h2>
        <p>Đây là ảnh chụp tại Kiosk trường ĐH Công nghệ thông tin của bạn.</p>
        <p>Chúc bạn có những giây phút trải nghiệm thú vị tại UIT🥰</p>
        <p><b>UIT Photobooth Team, MMLab 👨‍💻</b></p>
        `, // html body
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