const { Resend } = require("resend");

const sendEmail = (topic, to) => {
  const resend = new Resend(process.env.RESEND_API);
};

module.exports = { sendEmail };
