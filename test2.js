const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const port = process.env.PORT || 4001;
const index = require('./routes/index');
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);
// ! TEMP

server.listen(port, () => console.log(`Listening on port ${port}`));

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapIt(pagesNum) {
  // !

  var fullArray = [];
  try {
    const browser = await puppeteer.launch({
      headless: false
    });
    io.emit('process', 'Browser is launching...');
    const [page] = await browser.pages();
    await page.setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
    );

    for (var i = 0; i < pagesNum; i++) {
      const url = 'http://free-proxy.cz/en/proxylist/main/';
      await page.goto(`${url}${i + 1}`, {
        waitUntil: 'networkidle0'
      });
      io.emit('process', `Opening Page: ${url}${i + 1}`);

      await page.waitFor(3000);
      io.emit('process', `Waiting for 3 Seconds`);
      await page.waitFor(1000);
      const data = await page.evaluate(
        () => document.querySelector('*').outerHTML
      );
      const dom = new JSDOM(data);

      let fullTab = dom.window.document.querySelectorAll(
        '#proxy_list > tbody tr'
      );

      let Port;
      let Protocol;
      let Country;
      let Region;
      let City;
      let Anonymity;
      let Speed;
      let Uptime;
      let ResponseTime;
      let Lastchecked;
      fullTab.forEach(f => {
        let Encodedproxy = f.firstElementChild.textContent;
        try {
          Port = f.cells[1].textContent;
          Protocol = f.cells[2].textContent;
          Country = f.cells[3].textContent;
          Region = f.cells[4].textContent;
          City = f.cells[5].textContent;
          Anonymity = f.cells[6].textContent;
          Speed = f.cells[7].textContent;
          Uptime = f.cells[8].textContent;
          ResponseTime = f.cells[9].textContent;
          Lastchecked = f.cells[10].textContent;
        } catch (error) {
          Port = '';
          Protocol = '';
          Country = '';
          Region = '';
          City = '';
          Anonymity = '';
          Speed = '';
          Uptime = '';
          ResponseTime = '';
          Lastchecked = '';
        }

        var start_pos = Encodedproxy.indexOf('"') + 1;
        var end_pos = Encodedproxy.indexOf('"', start_pos);
        var text_to_get = Encodedproxy.substring(start_pos, end_pos);
        fullArray.push({
          proxy: Buffer.from(text_to_get, 'base64').toString('ascii'),
          Port: Port,
          Protocol: Protocol,
          Country,
          Region,
          City,
          Anonymity,
          Speed,
          Uptime,
          ResponseTime,
          Lastchecked
        });
      });
      io.emit('process', `We got it!, Number of proxies: ${fullArray.length}`);
      await page.waitFor(9000);
      io.emit('process', `Wait for 9 Seconds`);
      console.log(`Page ${i + 1} ✅`);
    }
    await browser.close();
  } catch (err) {
    console.error(err);
  }

  let newArray = fullArray.filter(value => JSON.stringify(value) !== '{}');
  let newArray2 = fullArray.filter(el => el.proxy !== '' && el.Port !== '');
  fullArray = [...newArray2];
  console.log(JSON.stringify(fullArray));
  console.log(fullArray.length);

  let writeStream = fs.createWriteStream('file.xls');
  let header =
    'IP' +
    '\t' +
    ' PORT' +
    '\t' +
    'Protocol' +
    '\t' +
    'Country' +
    '\t' +
    ' Region' +
    '\t' +
    ' City' +
    '\t' +
    ' Anonymity' +
    '\t' +
    ' Speed' +
    '\t' +
    ' Uptime' +
    '\t' +
    ' Response' +
    '\t' +
    ' Last Checked' +
    '\n';
  writeStream.write(header);
  for (var i = 0; i < fullArray.length; i++) {
    var row =
      fullArray[i].proxy +
      '\t' +
      fullArray[i].Port +
      '\t' +
      fullArray[i].Protocol +
      '\t' +
      fullArray[i].Country +
      '\t' +
      fullArray[i].Region +
      '\t' +
      fullArray[i].City +
      '\t' +
      fullArray[i].Anonymity +
      '\t' +
      fullArray[i].Speed +
      '\t' +
      fullArray[i].Uptime +
      '\t' +
      fullArray[i].ResponseTime +
      '\t' +
      fullArray[i].Lastchecked +
      '\n';
    writeStream.write(row);
  }
  writeStream.close();

  io.emit(
    'process',
    `Process Is Finished!, Proxies Number: ${fullArray.length}`
  );
}

scrapIt(150);
