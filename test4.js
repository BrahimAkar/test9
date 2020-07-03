const express = require('express');
const app = express();
const { Cluster } = require('puppeteer-cluster');

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    monitor: true,
    puppeteerOptions: {
      headless: false
    },
    maxConcurrency: 10
  });
  await cluster.task(async ({ page, data: url }) => {
    // make a screenshot
    await page.goto('http://' + url);
    const screen = await page.screenshot({
      path: `./pictures/${Date.now()}.png`
    });

    return screen;
  });

  // setup server
  app.get('/', async function(req, res) {
    if (!req.query.url) {
      return res.end('Please specify url like this: ?url=example.com');
    }
    try {
      res.send({
        Message: 'Process is started'
      });
      await cluster.execute(req.query.url);
    } catch (err) {
      // catch error
      res.end('Error: ' + err.message);
    }
  });

  app.listen(3000, function() {
    console.log('Screenshot server listening on port 3000.');
  });
})();
