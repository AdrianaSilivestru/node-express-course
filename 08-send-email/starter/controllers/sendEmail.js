const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

const sendEmailEthereal = async (req, res) => {
    let testaccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'willie.lubowitz@ethereal.email',
            pass: 'ceBhY7Vz4a3tjb5WVY'
        }
    });

    let info = await transporter.sendMail({
        from: '"Adriana Silivestru" <adriana.silivestru20@gmail.com>',
        to: "adriana.silivestru20@gmail.com",
        subject: "Hello",
        html: "<h2>Sending emails with Node.js</h2>"
    });

    res.json({ info });
};

const sendEmail = async (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: "adriana.silivestru20@gmail.com",
        from: "adriana.silivestru20@gmail.com",
        subject: "Sending with SendGrid",
        text: "with Node.js",
        html: "<strong>yay</strong>"
    };
    try {
        const info = await sgMail.send(msg);
        res.json({ info });
    } catch (err) {
        console.log(err);
    }

};

module.exports = sendEmail;