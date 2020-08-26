const express = require("express");
const app = express();
const server = require("http").createServer(app);
const transporter = require("./mailer");
const expression = require("./checkMail");
const config = process.env;
const illegalChar = require("./illegalChar.js");
const helmet = require("helmet");
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);


app.use(helmet());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false })); //to get response fromm

// parse application/json
app.use(express.json()); //to sumit form

app.post("/email", async (req, res) => {
  const { subject, body, recipient} = req.body;
  
  if (subject.length == 0 || subject.length > 100) {
    res.status(411).send("Subject length must be between 1 - 100 characters.");
  } else if (illegalChar.test(subject) == false) {
    res
      .status(411)
      .send({ message: "The email subject has illegal characters" });
  } else if (body.length == 0 || body.length > 1000) {
    res
      .status(411)
      .send("Email body length must be between 1 - 1000 charachters.");
  } else if (illegalChar.test(body) == false) {
    res
      .status(411)
      .send({ message: "The email body contains illegal characters" });
  } else if (expression.test(String(recipient).toLowerCase()) == false) {
    res.status(411).send("Check email address");
  } else {
    const mailOptions = {
      from: config.MAILUSER,
      to: recipient,
      subject: subject,
      text: body

    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(400).send({
          message: "Could not send email, got the following error :",
          error,
        });
      } else {
        res.status(200).send(info);
      }
    });
  }
});

app.post("/email_template", async (req, res) => {
  const { subject, body, recipient, mailData } = req.body;
  
  if (subject.length == 0 || subject.length > 100) {
    res.status(411).send("Subject length must be between 1 - 100 characters.");
  } else if (illegalChar.test(subject) == false) {
    res
      .status(411)
      .send({ message: "The email subject has illegal characters" });
  } else if (body.length == 0 || body.length > 1000) {
    res
      .status(411)
      .send("Email body length must be between 1 - 1000 charachters.");
  } else if (illegalChar.test(body) == false) {
    res
      .status(411)
      .send({ message: "The email body contains illegal characters" });
  } else if (expression.test(String(recipient).toLowerCase()) == false) {
    res.status(411).send("Check email address");

  }else if (mailData.name.length == 0 || mailData.name.length > 30) {
    res.status(411).send("Name length must be between 1 - 30 characters.");
  } else if (illegalChar.test(mailData.name) == false) {
    res
      .status(411)
      .send("The name has illegal characters");
  }else if (mailData.alarm_name.length == 0 || mailData.alarm_name.length > 30) {
    res.status(411).send("Alarm name length must be between 1 - 30 characters.");
  } else if (illegalChar.test(mailData.alarm_name) == false) {
    res
      .status(411)
      .send("The alarm name has illegal characters");
  } 
  else {
    var emailText = await readFile('mail_templates/simple_alert.html', 'utf8');
    emailText = emailText.replace(/{name}/g, mailData.name);
    emailText = emailText.replace(/{alarm_name}/g, mailData.alarm_name);
    emailText = emailText.replace(/{alarm_link}/g, mailData.alarm_link);
    

    
    const mailOptions = {
      from: 'Upsmarting Alarm <alarm@upsmarting.com>', //to do
      to: `'"${mailData.name}"' ${recipient}`,
      subject: subject,
      text: body,
      html: emailText,

    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(400).send({
          message: "Could not send email, got the following error :",
          error,
        });
      } else {
        res.status(200).send(info);
      }
    });
  }
  
});


const port = process.env.PORT ? process.env.PORT : 2000;
server.listen(port, (error) => {
  if (error) {
    console.log("error running the server");
  }
  console.log("App listening on port: ", server.address().port);
});
