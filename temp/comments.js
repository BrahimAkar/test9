// (async () => {
//   const proxies = {
//     keyword: "brahim akarouch",
//     website: "twitter.com",
//     proxies: [
//       {
//         IP: "45.94.47.66",
//         PORT: "80",
//         Type: "http",
//         USERNAME: "cvusfvkx-dest",
//         PASSWORD: "3j8mw0g29sd6",
//       },
//       {
//         IP: "193.8.94.225",
//         PORT: "80",
//         Type: "http",
//         USERNAME: "cvusfvkx-dest",
//         PASSWORD: "3j8mw0g29sd6",
//       },
//       {
//         IP: "45.94.47.108",
//         PORT: "80",
//         Type: "http",
//         USERNAME: "cvusfvkx-dest",
//         PASSWORD: "3j8mw0g29sd6",
//       },
//     ],
//   };

//   for (var i = 0; i < proxies.proxies.length; i++) {
//     try {
//       console.log(proxies.proxies[i].IP);
//       const browser = await puppeteer.launch({
//         headless: false,
//         args: [
//           "--no-sandbox",
//           "--disable-setuid-sandbox",
//           "--disable-dev-shm-usage",
//           "--single-process",
//           //  "--proxy-server=69.162.82.157:5836", // Woooooooooooorking
//           `--proxy-server=${proxies.proxies[i].IP}:${proxies.proxies[i].PORT}`, // Woooooooooooorking
//           // "--proxy-server=socks4://212.72.47.218:54321",
//         ],
//         ignoreDefaultArgs: ["--disable-extensions"],
//         ignoreHTTPSErrors: true,
//       });
//       const page = await browser.newPage();

//       await page.setViewport({ width: 1280, height: 800 });
//       await page.setUserAgent(
//         "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
//       );

//       //  await page.setUserAgent(userAgent);
//       await page.setDefaultNavigationTimeout(0);
//       await page.authenticate({
//         username: "cvusfvkx-dest",
//         password: "3j8mw0g29sd6",
//       });

//       await page.goto("https://whatismyipaddress.com", {
//         waitUntil: "networkidle2",
//       });

//       await browser.close();
//     } catch (error) {
//       console.log(error);
//     }
//   }
// })();

// await page.screenshot({
//   path: `./mypictures/${ScrapFunctions.fullDate()}.png`,
// });
// await page.waitFor(2000);
// await browser.close();
// if (true) {
//   continue;
// }
// const ip = proxies[i].IP.replace(`"`, ``);
// const port = proxies[i].PORT.replace(`"`, ``);
// console.log(ip);
// console.log(port);
// var randomUseragent = require('random-useragent');
// const userAgent = randomUseragent.getRandom(); // gets a random user agent string

// cloudinary.config({
//   cloud_name: "scapdatabase",
//   api_key: "462153821677272",
//   api_secret: "1nHNqeMz60x7Pgqf8rNYXYdChW0",
// });

// // cloudinary.uploader.upload("./../", function (error, result) {
// //   console.log(result, error);
// // });

// var randomnumber = uuidv1();
// clickedLinks = [];
// let keyword;
// let website;

// function saveObj(
//   href = "",
//   date,
//   proxy,
//   successProxy = true,
//   message = "",
//   ScreenShot = ""
// ) {
//   return {
//     Link: href,
//     Date: date,
//     Proxy: proxy,
//     ProxyIsSuccessed: successProxy,
//     message,
//     ScreenShot,
//   };
// }

// async function itemFound(aElementsWithHi, page, browser, proxy) {
//   for (var i = 0; i < aElementsWithHi.length; i++) {
//     try {
//       await aElementsWithHi[i].focus();
//       await aElementsWithHi[i].click({ button: "middle" });
//       const href = await page.evaluate((e) => e.href, aElementsWithHi[i]);

//       await page.screenshot({ path: `./pictures/${randomnumber}+${i}.png` });
//       let imgURL;
//       await cloudinary.uploader
//         .upload(`./pictures/${randomnumber}+${i}.png`, {
//           transformation: [{ width: 640, height: 400 }],
//         })
//         .then((res) => (imgURL = res.url));
//       clickedLinks.push(
//         saveObj(href, FullDate(), proxy, true, "Success", imgURL)
//       );
//     } catch (error) {
//       console.log(error);
//       clickedLinks.push(saveObj(null, FullDate(), proxy, false));
//     }
//   }
// }

// function FullDate() {
//   const today = new Date();
//   const date =
//     today.getFullYear() + "-" + (today.getMonth() + 1) + ":" + today.getDate();
//   const time =
//     today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//   const fullDate = date + " " + time;
//   return fullDate.toString();
// }

// async function openBrows(keyword, website) {
//   const proxy = "128.021.032.41";
//   const browser = await puppeteer.launch({
//     headless: false,
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     ignoreDefaultArgs: ["--disable-extensions"],
//   });
//   //   false;
//   const page = await browser.newPage();
//   await page.setViewport({ width: 1280, height: 800 });

//   await page.goto("https://google.com", {
//     waitUntil: "networkidle2",
//   });
//   await page.click("[name=q]");
//   await page.keyboard.type(`${keyword}`, {
//     delay: 50,
//   });
//   // // you forgot this
//   await page.keyboard.press("Enter");
//   await page.waitFor(5000);
//   //   const aElementsWithHi = await page.$x("//a[contains(., 'facebook')]");
//   const aElementsWithHi = await page.$x("//a[contains(., '" + website + "')]");
//   if (aElementsWithHi.length !== 0) {
//     console.log("we found it !!");
//     await itemFound(aElementsWithHi, page, browser, proxy);
//   } else {
//     console.log("we don't");
//   }
//   //   "//span[@text()='" + val + "']";

//   await page.waitFor(5000);
//   browser.close();
//   //   const allPage = await browser.pages();
//   //   console.log(clickedLinks);
//   //  console.log(allPage[aElementsWithHi.length - 2].url());
// }
// // openBrows();

// // Connect MongoDB

// //   console.log(keyWord);
// //   console.log(website);
// //   const browser = await puppeteer.launch({
// //     headless: false,
// //     // // devtools: true,
// //     // // args: ['--proxy-server=http://183.89.152.205:8080']
// //     // // args: [`--proxy-server=${proxyCode}`],
// //   });
// //   const page = await browser.newPage();
// //   page.setViewport({
// //     width: 1080,
// //     height: 760,
// //   });
// //   await page.setDefaultNavigationTimeout(555555);
// //   await page.goto("https://google.com", {
// //     waitUntil: "networkidle2",
// //   });
// //   await page.click("[name=q]");
// //   await page.keyboard.type(keyWord);
// //   // // you forgot this
// //   await page.keyboard.press("Enter");
// //   const keyword = ["linkedin", "facebook"];

// //   //   const elements = await page.$x(`//*[@class="ads-visurl"]/cite`);
// //   //   await elements[0].click();
// //   //   await page.screenshot({ path: "example.png" });
// // await page.screenshot({ path: `./pictures/${randomnumber}+${i}.png` });
// //   await page.waitFor(5000);
// //   // await browser.close();
// // });
// // function blockingWait(seconds) {
// //   var waitTill = new Date(new Date().getTime() + seconds * 1000);
// //   while (waitTill > new Date()) {}
// // }
// // //// (async () => {
// // ////   // const proxyCode = "http://178.128.245.87:3128";
// // //// })();

// !  sould work next await scrapMod.create(dataFromGoogle);

// dataFromGoogle.Success === true
//   ? res.status(500).json({
//       success: false,

//       message: dataFromGoogle[0].message,
//       // data: dataFromGoogle,
//     })
//   : res.status(201).json({
//       success: true,
//       proxy: "172.188.22.3",
//       message: "Everything is going great",
//       data: dataFromGoogle,
//     });
// const item = tours.find(el => el.id === id);
// item ? res.send(item) : res.send({ success: false });
//   proxy: proxies,
