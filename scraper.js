const puppeteer = require('puppeteer-extra');
const nodemailer = require('nodemailer');
const { v1: uuidv1 } = require('uuid');
const ScrapFunctions = require('./functions/scrapFunctions');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const scrapMod = require('./models/scrapModel');
const errorsMod = require('./models/errorsModel');

const randomUseragent = require('random-useragent');
const userAgent = randomUseragent.getRandom();
const dotenv = require('dotenv');
// app.use(index);
dotenv.config({ path: `./config.env` });
// const port = process.env.PORT || 4002;
var cloudinary = require('cloudinary').v2;
let scrapObj = [];
// ! Transporter
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

// server.listen(port, () => console.log(`Listening on port ${port}`));
// ! Mail options

// ! Puppeteer Middleware

puppeteer.use(StealthPlugin());

// ! CLoudinary API Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

function getHtmlEmail(pageTitle) {
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
  return template;
}

// ! ***************************************************************** ! //

// ! ***************************************************************** ! //
let pageTitle;
let liveStepCount;
async function runScrapWithProxy(
  keyword,
  website,
  proxies = [],
  numproxies,
  method
) {
  let browser;
  let howLong = proxies.length === 0 ? 1 : proxies.length;

  for (var i = 0; i < howLong; i++) {
    for (var j = 0; j < numproxies; j++) {
      method.method === 'custom'
        ? (liveStepCount = i + 1 + '/ ' + proxies.length)
        : method.method === 'premium'
        ? (liveStepCount = j + 1 + '/' + numproxies)
        : (liveStepCount = 1);
      try {
        scrapObj = [];
        browser = await puppeteer.launch({
          headless: false,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process',
            proxies.length === 0
              ? ''
              : `--proxy-server=${proxies[i].IP}:${proxies[i].PORT}`
          ],
          ignoreDefaultArgs: ['--disable-extensions'],
          ignoreHTTPSErrors: true
        });
        io.emit('process', `${liveStepCount} ⌛ Browser is launching... 🌐`);
        const page = await browser.newPage();

        await page.waitFor(2000);
        if (method.method === 'custom') {
          io.emit('process', `Proxy : ...${proxies[i].IP} 🆗`);
        } else if (method.method === 'premium') {
          io.emit('process', `Proxy : Premium 🔥`);
        } else if (method.method === 'ip') {
          io.emit('process', `IP SERVER 🔥`);
        }

        await page.setViewport({ width: 1280, height: 800 });

        await page.setRequestInterception(true);
        await page.waitFor(3000);
        io.emit(
          'process',
          `${liveStepCount} ⌛ Block all images and other media files 🚫`
        );
        await page.waitFor(3000);
        page.on('request', request => {
          const url = request.url().toLowerCase();
          const resourceType = request.resourceType();
          if (
            resourceType == 'media' ||
            resourceType == 'image' ||
            url.endsWith('.mp4') ||
            url.endsWith('.mp3') ||
            url.endsWith('.avi') ||
            url.endsWith('.flv') ||
            url.endsWith('.mov') ||
            url.endsWith('.wmv')
          ) {
            request.abort();
          } else {
            request.continue();
          }
        });
        await page.setDefaultNavigationTimeout(0);
        await page.waitFor(2000);
        io.emit('process', `${liveStepCount} ⌛ Proxy Authentication 🔓`);
        await page.waitFor(2000);
        await page.authenticate({
          username: 'k9o9jsow',
          password: 'iSQkDTUPyChhujxf'
        });
        io.emit('process', `${liveStepCount} ⌛ Opening Google Search Page 🟩`);
        await page
          .goto('https://google.com', {
            waitUntil: 'networkidle2'
          })
          .catch(async err => {
            throw err;
          });

        // await page.waitFor(15000);
        await page.waitFor(5000);
        io.emit(
          'process',
          `${liveStepCount} ⌛ Typing the keyword: ${keyword} 🔠`
        );
        await page.waitFor(1000);
        await page.click('[name=q]').catch(err => {
          throw err;
        });
        await page.keyboard.type(keyword, {
          delay: 80
        });

        await page.keyboard.press('Enter');

        await page.waitFor(5000);

        const visitLink = async (index = 0) => {
          await page.waitFor(2000);
          io.emit(
            'process',
            `${liveStepCount} ⌛ Search then select matches results 🔍`
          );
          await page.waitFor(2000);

          // ! click without give a fuch to ads
          // const links = await page.$x("//a[contains(., '" + website + "')]");
          const links = await page.$x(
            "//li/div[contains(@class, 'ad_cclk') ]/a [not(contains(@style,'display:none')) and contains(.,'" +
              website +
              "')]"
          );

          // ! Not working -_- !
          // const links = await page.$x(
          //   "//a[contains(., '" + keyword + "') and contains(@data-rw,'adurl')]"
          // );
          // const links = await page.$x(
          //   "//li/div[contains(@class, 'ad_cclk') ]/a [not(contains(@style,'display:none')) and contains(.,'" + test + "')]"
          // );

          if (links.length === 0) {
            io.emit(
              'process',
              `${liveStepCount} ⌛ Proxy dead or no website at first google page!`
            );
            throw 'Proxy Dead/ or no websites at first google page!';
          }
          if (links[index]) {
            await page.waitFor(2000);
            io.emit(
              'process',
              `${liveStepCount} ⌛ Clicking on ${index + 1} element 🖱️`
            );
            await page.waitFor(2000);
            console.log('Clicking ', index);
            var randomnumber = uuidv1();
            await Promise.all([
              await page.evaluate(element => {
                element.focus();
                element.click({ waitUntil: 'domcontentloaded' });
              }, links[index]),

              //    await page.waitForNavigation({ waitUntil: 'networkidle0' }),

              await page.screenshot({
                path: `./pictures/${randomnumber}.png`
              }),
              await page.waitFor(2000)
            ]);
            await page.waitFor(2000);
            io.emit('process', `${liveStepCount} ⌛ Taking a screenshot... 🖼️`);
            await page.waitFor(2000);
            const CurrentPageTitle = await page.title();
            pageTitle = CurrentPageTitle;
            const CurrentPageLink = await page.url();
            io.emit(
              'process',
              `Page title: ${pageTitle}, |
               Page Url: ${CurrentPageLink}`
            );

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
            scrapObj.push(
              ScrapFunctions.getTheObject(
                true,
                'Everything works great!',
                CurrentPageTitle,
                CurrentPageLink,
                picturePath,
                ScrapFunctions.fullDate(),
                // ! proxies.length === 0 && numproxies === 1
                // !   ? 'Server IP'
                // !   : proxies.length !== 0
                // !   ? proxies[i].IP
                // !   : 'PREMIUM PROXY'

                method.method === 'custom'
                  ? proxies[i].IP
                  : method.method === 'premium'
                  ? 'PREMIUM'
                  : 'IP SERVER'
              )
            );

            console.log(scrapObj);
            await page.waitFor(2000),
              // go back and visit next link
              io.emit(
                'process',
                `${liveStepCount} ⌛ GO back to the previous google page... 🔙`
              );
            await page.goBack({
              waitUntil: 'networkidle0' || domcontentloaded
            });
            return visitLink(index + 1);
          }
          console.log('No links left to click');
          io.emit('process', `Task ${i + 1} is finshed with success...  🔰`);
          await page.waitFor(1000);
        };

        await visitLink();
        await page.waitFor(1000);
        io.emit('process', `${liveStepCount} ⌛ Sending result to Gmail... 📨`);
        await page.waitFor(1000);
        // ! Email
        let mailOptions = {
          from: 'Node JS',
          to: 'brahim.akarouch@gmail.com',
          subject: 'Testing',
          html: getHtmlEmail(pageTitle)
        };

        // ! Sending Email
        transporter.sendMail(mailOptions, function(err, data) {
          if (err) {
            console.log('error');
          } else {
            console.log('email is working');
          }
        });
        await browser.close();
        io.emit('process', `Save Results to database...💽`);
        await page.waitFor(2000);
        await scrapMod.create(scrapObj);
        io.emit('process', `Tasks finished ... ✅`);
      } catch (err) {
        let errorMessage = err.message || err;
        io.emit('process', `❌ ERROR ❌ : ${errorMessage} `);
        console.log('Error: ', errorMessage);
        scrapObj = [];
        let ip = '';

        scrapObj.push(
          ScrapFunctions.getTheObject(
            false,
            errorMessage,
            '',
            '',
            '',
            ScrapFunctions.fullDate(),
            method.method === 'custom'
              ? proxies[i].IP
              : method.method === 'premium'
              ? 'PREMIUM'
              : 'IP SERVER'
          )
        );
        console.log(scrapObj);
        await errorsMod.create(scrapObj);

        await browser.close();
      }
    }
  }
}

module.exports = runScrapWithProxy;
