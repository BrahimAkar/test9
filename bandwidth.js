const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

let browser;
async function bandwidthFun() {
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ],
      ignoreDefaultArgs: ['--disable-extensions'],
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();
    await page.goto('https://app.proxy-cheap.com/login', {});
    await page
      .waitForFunction(() => document.querySelector('#inputEmail'))
      .then(res => console.log('Email Input is loaded'));
    await page
      .waitForFunction(() => document.querySelector('#inputPassword'))
      .then(res => console.log('Password Input is loaded'));
    await page
      .waitForFunction(() => document.querySelector('form > div > button'))
      .then(res => console.log('Button is loaded'));
    await page.type('#inputEmail', 'brahim.akarouch@gmail.com', {});
    await page.type('#inputPassword', 'C8AvxBehb!xBy4f', {});
    await page.click('form > div > button');

    await page
      .waitForFunction(() => document.querySelector('a.aside-logo'))
      .then(res => console.log('Dashboard is loaded'));
    await page.goto(
      'https://app.proxy-cheap.com/dashboard/services/my-proxies'
    );
    await page
      .waitForFunction(() => document.querySelector('#residential-proxies-tab'))
      .then(res => console.log('Residential Tab is loaded'));
    await page.click('#residential-proxies-tab');

    const data = await page.evaluate(
      () => document.querySelector('*').outerHTML
    );
    const dom = new JSDOM(data);
    let fullTab = dom.window.document.querySelectorAll('.table-dashboard tr');

    let Fulldata = {
      message: 'Success',
      bandwidthLimit: fullTab[2].cells[1].textContent.trim(),
      bandwidthUsage: fullTab[2].cells[2].textContent.trim().substring(0, 9),
      activateOn: fullTab[2].cells[3].textContent.trim().substring(0, 16),
      status: fullTab[2].cells[4].textContent.trim()
    };
    console.log(Fulldata);
    await browser.close();
    return Fulldata;
    // other actions...
    // await browser.close();
  } catch (error) {
    let Fulldata = {
      message: error.message,
      bandwidthLimit: '',
      bandwidthUsage: '',
      activateOn: '',
      status: ''
    };
    await browser.close();
    return Fulldata;
  }
}

module.exports = bandwidthFun;
