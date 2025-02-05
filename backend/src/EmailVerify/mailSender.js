import nodemailer from "nodemailer";
import hbs from 'nodemailer-express-handlebars'

export const mailSender = async (email,token) => {
  
  console.log("mail",email);
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kundupriyojit21@gmail.com",
        pass: process.env.MAIL_PASSWORD,
      },
    });

    transporter.use('compile', hbs({
      viewEngine: {
          extname: '.hbs',
          layoutsDir: './src/template',
          defaultLayout: false,
          partialsDir: './src/template',
      },
      viewPath: './src/template',
      extName: '.hbs'
  }));

  
    const mailConfiguration = {
      from: 'Priyojit Kundu',
      to: email,
      subject: 'Email Verification',
      template: 'email',
      context: {
        token : `${token}`
      }
    };

  
    transporter.sendMail(mailConfiguration, (error, res) => {
      if (error) 
      {
        console.log(error);
      }
      else {
        console.log("Email sent successfully");
        console.log(res);
      }
    });
  };