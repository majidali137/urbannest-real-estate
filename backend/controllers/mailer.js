const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')

var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9134edbb88e8e7",
      pass: "903d3dc2c9157b"
    }
  });

  

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})

const sendMail = async (obj) => {
    const {username, userEmail, text, subject} = obj;

    var email = {
        body: {
            name: username,
            intro: text || "Welcome to urbannest. We are very excited to have you onboard",
            outro: "Need help or have any questions? Just reply to this email and we would love to help you"
        }
    }

    var emailBody = MailGenerator.generate(email)

    let message = {
        from: process.env.NODE_EMAIL,
        to: userEmail,
        subject: subject || "Signup successful",
        html: emailBody
    }

    transporter.sendMail(message)
    .then(() => {
        console.log('Email sent')
        return {succes: true, message: "You should recieve an email from us."}
    })
    .catch(err => {
        console.log("Error while sending mail", err)
        return {success: false, err: err.message}})
}
module.exports = {sendMail}