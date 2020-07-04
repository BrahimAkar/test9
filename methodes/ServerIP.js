// const puppeteer = require('puppeteer-extra');
// const nodemailer = require('nodemailer');
// const { v1: uuidv1 } = require('uuid');
// const ScrapFunctions = require('./functions/scrapFunctions');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const scrapMod = require('./models/scrapModel');
// const errorsMod = require('./models/errorsModel');

// const randomUseragent = require('random-useragent');
// const userAgent = randomUseragent.getRandom();
// const dotenv = require('dotenv');
// // app.use(index);
// dotenv.config({ path: `./config.env` });
// // const port = process.env.PORT || 4002;
// var cloudinary = require('cloudinary').v2;
// let scrapObj = [];
// // ! Transporter
// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_EMAIL,
//     pass: process.env.GMAIL_PASSWORD
//   }
// });

// // server.listen(port, () => console.log(`Listening on port ${port}`));
// // ! Mail options

// // ! Puppeteer Middleware

// puppeteer.use(StealthPlugin());

// // ! CLoudinary API Config
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET
// });

// // ! ***************************************************************** ! //

// // ! ***************************************************************** ! //
// let pageTitle;
// let liveStepCount;
// async function runScrapWithProxy(keyword, website, clicksNum = 1) {
//   let browser;
//   let howLong = proxies.length === 0 ? 1 : proxies.length;

//   for (var i = 0; i < clicksNum; i++) {
//     liveStepCount = i + 1 + '/' + clicksNum;
//     try {
//       scrapObj = [];
//       browser = await puppeteer.launch({
//         headless: true,
//         args: [
//           '--no-sandbox',
//           '--disable-setuid-sandbox',
//           '--disable-dev-shm-usage',
//           '--single-process'
//         ],
//         ignoreDefaultArgs: ['--disable-extensions'],
//         ignoreHTTPSErrors: true
//       });
//       io.emit('process', `${liveStepCount} ⌛ Browser is launching... 🌐`);
//       const page = await browser.newPage();
//       io.emit('process', `IP SERVER 🔥`);
//       await page.setViewport({ width: 1280, height: 800 });
//       await page.setRequestInterception(true);
//       await page.waitFor(3000);
//       io.emit(
//         'process',
//         `${liveStepCount} ⌛ Block all images and other media files 🚫`
//       );
//       await page.waitFor(3000);
//       page.on('request', request => {
//         const url = request.url().toLowerCase();
//         const resourceType = request.resourceType();
//         if (
//           resourceType == 'media' ||
//           resourceType == 'image' ||
//           url.endsWith('.mp4') ||
//           url.endsWith('.mp3') ||
//           url.endsWith('.avi') ||
//           url.endsWith('.flv') ||
//           url.endsWith('.mov') ||
//           url.endsWith('.wmv')
//         ) {
//           request.abort();
//         } else {
//           request.continue();
//         }
//       });
//       await page.setDefaultNavigationTimeout(0);
//       await page.waitFor(2000);
//       io.emit('process', `${liveStepCount} ⌛ Proxy Authentication 🔓`);
//       await page.waitFor(2000);
//       await page.authenticate({
//         username: 'k9o9jsow',
//         password: 'iSQkDTUPyChhujxf'
//       });
//       io.emit('process', `${liveStepCount} ⌛ Opening Google Search Page 🟩`);
//       await page
//         .goto('https://google.com', {
//           waitUntil: 'networkidle2'
//         })
//         .catch(async err => {
//           throw err;
//         });
//       await page.waitFor(5000);
//       io.emit(
//         'process',
//         `${liveStepCount} ⌛ Typing the keyword: ${keyword} 🔠`
//       );
//       await page.waitFor(1000);
//       await page.click('[name=q]').catch(err => {
//         throw err;
//       });
//       await page.keyboard.type(keyword, {
//         delay: 80
//       });

//       await page.keyboard.press('Enter');

//       await page.waitFor(5000);

//       const visitLink = async (index = 0) => {
//         await page.waitFor(2000);
//         io.emit(
//           'process',
//           `${liveStepCount} ⌛ Search then select matches results 🔍`
//         );
//         await page.waitFor(9000);

//         // ! click without give a fuch to ads
//         // const links = await page.$x("//a[contains(., '" + website + "')]");
//         const links = await page.$x(
//           "//li/div[contains(@class, 'ad_cclk') ]/a [not(contains(@style,'display:none')) and contains(.,'" +
//             website +
//             "')]"
//         );
//         await page.waitFor(9000);

//         if (links.length === 0) {
//           io.emit(
//             'process',
//             `${liveStepCount} ⌛ Proxy dead or no website at first google page!`
//           );
//           throw 'Proxy Dead/ or no websites at first google page!';
//         }
//         if (links[index]) {
//           await page.waitFor(2000);
//           io.emit(
//             'process',
//             `${liveStepCount} ⌛ Clicking on ${index + 1} element 🖱️`
//           );
//           await page.waitFor(2000);
//           console.log('Clicking ', index);
//           var randomnumber = uuidv1();
//           await Promise.all([
//             await page.evaluate(element => {
//               element.focus();
//               element.click({ waitUntil: 'domcontentloaded' });
//             }, links[index]),
//             await page.screenshot({
//               path: `./pictures/${randomnumber}.png`
//             }),
//             await page.waitFor(2000)
//           ]);
//           await page.waitFor(2000);
//           io.emit('process', `${liveStepCount} ⌛ Taking a screenshot... 🖼️`);
//           await page.waitFor(2000);
//           const CurrentPageTitle = await page.title();
//           pageTitle = CurrentPageTitle;
//           const CurrentPageLink = await page.url();
//           io.emit(
//             'process',
//             `Page title: ${pageTitle}, |
//                Page Url: ${CurrentPageLink}`
//           );

//           await cloudinary.uploader
//             .upload(`./pictures/${randomnumber}.png`, {
//               transformation: [{ width: 640, height: 400 }]
//             })
//             .then(res => {
//               picturePath = res.url;
//               io.emit(
//                 'process',
//                 `${liveStepCount} ⌛ Screenshot uploaded to cloudinary with success 📶`
//               );
//             });
//           scrapObj.push(
//             ScrapFunctions.getTheObject(
//               true,
//               'Everything works great!',
//               CurrentPageTitle,
//               CurrentPageLink,
//               picturePath,
//               ScrapFunctions.fullDate(),

//               'IP SERVER'
//             )
//           );

//           console.log(scrapObj);
//           await page.waitFor(2000),
//             // go back and visit next link
//             io.emit(
//               'process',
//               `${liveStepCount} ⌛ GO back to the previous google page... 🔙`
//             );
//           await page.goBack({
//             waitUntil: 'networkidle0' || domcontentloaded
//           });
//           return visitLink(index + 1);
//         }
//         console.log('No links left to click');
//         io.emit('process', `Task ${i + 1} is finshed with success...  🔰`);
//         await page.waitFor(1000);
//       };

//       await visitLink();
//       await page.waitFor(1000);
//       io.emit('process', `${liveStepCount} ⌛ Sending result to Gmail... 📨`);
//       await page.waitFor(1000);

//       // ! Send email
//       ScrapFunctions.sendEmail(scrapObj, pageTitle);

//       await browser.close();
//       io.emit('process', `Save Results to database...💽`);
//       await page.waitFor(2000);
//       await scrapMod.create(scrapObj);
//       io.emit('process', `Tasks finished ... ✅`);
//     } catch (err) {
//       let errorMessage = err.message || err;
//       io.emit('process', `❌ ERROR ❌ : ${errorMessage} `);
//       console.log('Error: ', errorMessage);
//       scrapObj = [];
//       let ip = '';

//       scrapObj.push(
//         ScrapFunctions.getTheObject(
//           false,
//           errorMessage,
//           '',
//           '',
//           '',
//           ScrapFunctions.fullDate(),
//           'IP SERVER'
//         )
//       );
//       console.log(scrapObj);
//       await errorsMod.create(scrapObj);

//       await browser.close();
//     }
//   }
// }

// module.exports = runScrapWithProxy;
