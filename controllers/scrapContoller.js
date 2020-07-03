const runScrapWithProxy = require('../scraper');
const scrapMod = require('./../models/scrapModel');
const errorsMod = require('./../models/errorsModel');
const bandwidthFun = require('./../bandwidth');
// ! Scrap with Proxy

const runProxyScrap = async (req, res) => {
  keyword = req.body.keyword;
  website = req.body.website;
  proxies = req.body.proxies;
  whatMethod = {
    method: 'custom'
  };
  if (!keyword || !website || !req.body.proxies) {
    res.status(500).json({
      success: false,

      message: 'Please, be sure you provide a Website/Keyword/Proxies ...'
    });
  } else {
    res.status(201).json({
      success: true,
      proxy: req.body.proxies,
      message: 'The process is starting...'
    });
    await runScrapWithProxy(keyword, website, req.body.proxies, 1, whatMethod);
  }
};

// ! Scrap with Premium Proxy

const runPremiumProxyScrap = async (req, res) => {
  keyword = req.body.keyword;
  website = req.body.website;
  numproxies = req.body.numproxies;
  whatMethod = {
    method: 'premium'
  };
  if (!keyword || !website || !req.body.numproxies) {
    res.status(500).json({
      success: false,

      message:
        'Please, be sure you provide a Website/Keyword/Number of Proxies ...'
    });
  } else {
    res.status(201).json({
      success: true,
      proxy: req.body.numproxies,
      message: 'The process is starting...'
    });
    await runScrapWithProxy(keyword, website, [], numproxies, whatMethod);
  }
};

// ! Scrap with server IP

const runIpScrap = async (req, res) => {
  keyword = req.body.keyword;
  website = req.body.website;
  whatMethod = {
    method: 'ip'
  };
  if (!keyword || !website) {
    res.status(500).json({
      success: false,

      message: 'Please, be sure you provide a Website/Keyword.'
    });
  } else {
    res.status(201).json({
      success: true,
      IP: 'Server IP',
      message: 'The process is starting...'
    });
    await runScrapWithProxy(keyword, website, [], 1, whatMethod);
  }
};

// ! Get All Results

const getAll = async (req, res) => {
  const data = await scrapMod.find({}).sort({ _id: 'desc' });
  const len = await scrapMod.count({});

  res.send({
    length: len,
    success: 'True',
    data
  });
};

const getbadresults = async (req, res) => {
  const data = await errorsMod.find({}).sort({ dateTime: 'desc' });

  const len = await errorsMod.count({});
  res.send({
    length: len,
    success: 'false',
    data
  });
};

const bandwidth = async (req, res) => {
  const Fulldata = await bandwidthFun();
  res.send({
    message: 'Hello for bandwidth',
    data: Fulldata
  });
};

module.exports = {
  runProxyScrap,
  runIpScrap,
  getAll,
  getbadresults,
  runPremiumProxyScrap,
  bandwidth
};
