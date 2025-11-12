import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "taskManager",
      link: "https://taskmanager.com",
    },
  });

  const emailHtml = mailGenerator.generatePlaintext(options.mailgenContent);
  nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    author: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });
};
const emailVerificationMailGenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "welcome to our app ! we are excited to  have you on board",
      action: {
        instructions:
          "to verify your email pleas click on the  following button",
        button: {
          color: "green",
          text: "verify your emaill",
          link: verificationUrl,
        },
      },
      outro:
        "need help or questions just reply to thandu.prameela321@gmail.com",
    },
  };
};

export { emailVerificationMailGenContent };
