
import nodemailer from "nodemailer";


 async function sendEmail({ to, html, attachments = [], subject } = {}) {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',

        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Shaimaa E-Commerce Project" <${process.env.EMAIL}>`, // sender address
        to, // list of receivers
        subject,
        html, // html body
        attachments
    });

    if (info.rejected.length) {
        return false
    }
    else {
        return true
    }

}

export default sendEmail