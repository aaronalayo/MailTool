const express = require("express");
const app = express();
const server = require("http").createServer(app);
const transporter = require("./mailer");
const config = process.env;
const helmet = require("helmet");
const fs = require('fs');
const { promisify } = require('util');
const { generalTextFilter, eMailFilter } = require("./generalTextFilter");
const readFile = promisify(fs.readFile);


app.use(helmet());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false })); //to get response fromm

// parse application/json
app.use(express.json()); //to sumit form

app.get("/test", async (req, res) => {
  res.status(200).send("Hello");
});

app.post("/email", async (req, res) => {
  const { subject, body, recipient} = req.body;
  if (subject == undefined || body == undefined ||recipient == undefined) {
    res.status(411).send("Error in body. Required field left undefined.")
    return
  }

  console.log(req.body);
  
  if (subject.length == 0 || subject.length > 100) {
    res.status(411).send("Subject length must be between 1 - 100 characters.");
  } else if (generalTextFilter.test(subject) == false) {
    res
      .status(411)
      .send({ message: "The email subject has illegal characters" });
  } else if (body.length == 0 || body.length > 1000) {
    res
      .status(411)
      .send("Email body length must be between 1 - 1000 charachters.");
  } else if (generalTextFilter.test(body) == false) {
    res
      .status(411)
      .send({ message: "The email body contains illegal characters" });
  } else if (eMailFilter.test(String(recipient).toLowerCase()) == false) {
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
  const { subject, recipient, raw_text, mailData } = req.body;

  if (subject.length == 0 || subject.length > 100) {
    res.status(411).send("Subject length must be between 1 - 100 characters.");
  } else if (generalTextFilter.test(subject) == false) {
    res
      .status(411)
      .send({ message: "The email subject has illegal characters" });
  } else if (eMailFilter.test(String(recipient).toLowerCase()) == false) {
    res.status(411).send("Check email address");
  }else if (raw_text.length == 0 || raw_text.length > 1000) {
    res
      .status(411)
      .send("Email raw text length must be between 1 - 1000 charachters.");
  } else if (generalTextFilter.test(raw_text) == false) {
    res
      .status(411)
      .send({ message: "The email raw text contains illegal characters" });
  } else if (mailData.name.length == 0 || mailData.name.length > 30) {
    res.status(411).send("Name length must be between 1 - 30 characters.");
  } else if (generalTextFilter.test(mailData.name) == false) {
    res
      .status(411)
      .send("The name has illegal characters");
  } else if (mailData.device.length == 0 || mailData.device.length > 30) {
      res.status(411).send("Device name length must be between 1 - 30 characters.");
  } else if (generalTextFilter.test(mailData.device) == false) {
      res
        .status(411)
        .send("The device name has illegal characters");
  } else {

    var emailText = await readFile('src/mail_templates/simple_alert.html', 'utf8');
    emailText = emailText.replace(/{timestamp}/g, mailData.timestamp);
    emailText = emailText.replace(/{name}/g, mailData.name);
    emailText = emailText.replace(/{dashboard_link}/g, mailData.dashboard_link);
    emailText = emailText.replace(/{device_name}/g, mailData.device);

    emailText = emailText.replace(/{mt_val}/g, mailData.mt_val);
    emailText = emailText.replace(/{mt_res}/g, mailData.mt_res);

    emailText = emailText.replace(/{sd_val}/g, mailData.sd_val);
    emailText = emailText.replace(/{sd_res}/g, mailData.sd_res);

    emailText = emailText.replace(/{pd_val}/g, mailData.pd_val);
    emailText = emailText.replace(/{pd_res}/g, mailData.pd_res);

    emailText = emailText.replace(/{tsp_val}/g, mailData.tsp_val);
    emailText = emailText.replace(/{tsp_res}/g, mailData.tsp_res);
    
    
    const mailOptions = {
      from: 'Upsmarting Alarm <alarm@upsmarting.com>', //to do
      to: `'"${mailData.name}"' ${recipient}`,
      subject: subject,
      text: raw_text,
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
  console.log("App listening on port: ", server.address().port)
});
