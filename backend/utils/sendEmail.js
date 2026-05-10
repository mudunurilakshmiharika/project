const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection configuration
    await transporter.verify();
    console.log("🚀 Mailer connection verified successfully");

    const mailOptions = {
      from: `"LuxeStore Orders" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email Error Details:", error);
    if (error.code === 'EAUTH') {
      console.log("👉 Tip: Authentication failed. Please use a Gmail 'App Password' if you have 2FA enabled.");
    }
    return false;
  }
};

module.exports = sendEmail;
