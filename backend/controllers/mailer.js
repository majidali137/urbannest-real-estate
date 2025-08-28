require("dotenv").config();
const { Resend } = require("resend");
const Mailgen = require("mailgen");

const resend = new Resend(process.env.RESEND_API_KEY);

const MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Urbannest",
    link: "https://urbannest.com",
  },
});

const sendMail = async (obj) => {
  const { username, userEmail, text, subject } = obj;

  const email = {
    body: {
      name: username,
      intro:
        text ||
        "Welcome to Urbannest. We are very excited to have you onboard!",
      outro:
        "Need help or have any questions? Just reply to this email and we’d love to help you.",
    },
  };

  const emailBody = MailGenerator.generate(email);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_EMAIL_SENDER,
      to: userEmail,
      subject: subject || "Signup successful",
      html: emailBody,
    });

    if (error) {
      console.error("Error while sending mail:", error);
      return { success: false, err: error.message };
    }

    console.log("✅ Email sent:", data);
    return { success: true, message: "You should receive an email from us." };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { success: false, err: err.message };
  }
};

module.exports = { sendMail };
