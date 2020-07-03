const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const port = 4002;
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

io.on('connection', socket => {
  console.log('New client connected'),
    socket.on('disconnect', () => console.log('Client disconnected'));
});

async function scrapIt() {
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

    const url = 'https://free-proxy-list.net/';
    await page.goto(`${url}`, {
      waitUntil: 'networkidle0'
    });
    io.emit('process', `Opening Page: ${url}`);

    await page.waitFor(3000);
    io.emit('process', `Waiting for 3 Seconds`);
    await page.waitFor(1000);
    const data = await page.evaluate(
      () => document.querySelector('*').outerHTML
    );
    const dom = new JSDOM(data);
    console.log('your dom is :', dom);
    let fullTab = dom.window.document.querySelectorAll(
      '#proxylisttable > tbody tr'
    );
    console.log(fullTab);

    let Proxy;
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
      try {
        Proxy = f.firstElementChild.textContent;

        Port = f.cells[1].textContent;
        Protocol = '';
        Country = f.cells[3].textContent;
        Region = '';
        City = '';
        Anonymity = f.cells[4].textContent;
        Speed = '';
        Uptime = '';
        ResponseTime = '';
        Lastchecked = f.cells[7].textContent;
      } catch (error) {
        Proxy = '';
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

      fullArray.push({
        proxy: Proxy,
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

    await browser.close();
  } catch (err) {
    console.error(err);
  }

  var newArray = fullArray.filter(value => JSON.stringify(value) !== '{}');
  var newArray2 = fullArray.filter(el => el.proxy !== '' && el.Port !== '');
  fullArray = [...newArray2];
  console.log(JSON.stringify(fullArray));
  console.log(fullArray.length);

  var writeStream = fs.createWriteStream('file.xls');
  var header =
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

scrapIt();
