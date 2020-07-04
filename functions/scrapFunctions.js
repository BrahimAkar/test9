const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer-extra');
dotenv.config({ path: `./config.env` });
var cloudinary = require('cloudinary').v2;
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});
// ! CLoudinary API Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const ScrapFunctions = {
  getTheObject: (
    Success = true,
    Message,
    pageTitle,
    PageLink,
    screenPath,
    dateTime,
    proxy
  ) => {
    return {
      Success: Success,
      Message: Message,
      PageTitle: pageTitle,
      PageLink: PageLink,
      screenPath: screenPath,
      dateTime: dateTime,
      proxy
    };
  },
  fullDate: () => {
    const today = new Date();
    const date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    const time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const fullDate = date + ' ' + time;
    return fullDate.toString();
  },
  sendEmail: (scrapObj, pageTitle) => {
    var template = '';
    for (var i = 0; i < scrapObj.length; i++) {
      template += `
        <h1> Page Title : | ${pageTitle} </h1>
    <b> Success : | ${scrapObj[i].Success} </b> <br>
  
    <b> Page Link : |   ${scrapObj[i].PageLink} </b> <br>
    <b> ScreenShoot : |   ${scrapObj[i].screenPath} </b> <br>
    <b> Date : |   ${scrapObj[i].dateTime} </b> <br>
    <b style="color:red"> Proxy : |   ${scrapObj[i].proxy} </> <br>
    `;
    }
    console.log('YOUR EMAIL IS:', template);
    let mailOptions = {
      from: 'Node JS',
      to: 'brahim.akarouch@gmail.com',
      subject: 'Testing',
      html: template
    };
    transporter.sendMail(mailOptions, function(err, data) {
      if (err) {
        console.log('error');
      } else {
        console.log('email is working');
      }
    });
  },
  uploadToCloudinart: async (randomnumber, liveStepCount) => {
    let picturePath;
    await cloudinary.uploader
      .upload(`./pictures/${randomnumber}.png`, {
        transformation: [{ width: 640, height: 400 }]
      })
      .then(res => {
        picturePath = res.url;
        io.emit(
          'process',
          `${liveStepCount} ⌛ Screenshot uploaded to cloudinary with success 📶`
        );
      });
    return picturePath;
  },
  initiateBrowser: async (proxy, type, liveStepCount) => {
    let browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',
        `${proxy}`
      ],
      ignoreDefaultArgs: ['--disable-extensions'],
      ignoreHTTPSErrors: true
    });
    io.emit('process', `${liveStepCount} ⌛ Browser is launching... 🌐`);
    console.log(proxy);
    return browser;
  }
};

module.exports = ScrapFunctions;
