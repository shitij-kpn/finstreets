const nodemailer = require("nodemailer");

const sendEmail = async (email, OTP) => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mailOptions = {
    from: '"finstreet" <finstreet@finstreet.finstreet>',
    to: email,
    subject: "Verify Email",
    text: `Your OTP is ${OTP}`,
  };

  const result = await transporter.sendMail(mailOptions);

  console.log(
    `Mail sent\n check mail at ${nodemailer.getTestMessageUrl(result)}`
  );
};

module.exports = sendEmail;
