import { Resend } from "resend";

const sendEmail = async (topic, to, data) => {
  try {
    const resend = new Resend(process.env.RESEND_API);
    let subject, html;
    switch (topic) {
      case "register":
        subject = "Regsiterred Successfully";
        html = `<h1>Regsitered Successfully</h1>`;
      case "enrollment":
        subject = "Enrolled Successfully";
        html = `<h1>Enrolled Successfully in ${data.course}</h1>`;
    }
    await resend.emails.send({
      from: "example@gmail.com",
      to: to,
      subject: subject,
      html: html,
    });
  } catch (error) {
    console.log(error);
  }
};

export default { sendEmail };
