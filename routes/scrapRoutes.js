const express = require('express');
const app = express();
const router = express.Router();
const {
  runProxyScrap,
  getAll,
  runIpScrap,
  getbadresults,
  runPremiumProxyScrap,
  bandwidth
} = require('../controllers/scrapContoller');
const rateLimit = require('express-rate-limit');

// ! Limiter
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 1 minutes
  max: 1 // limit each IP to 1 requests per windowMs
});

// ! Routes limiter,limiter
router.route('/runproxyscrap').post(runProxyScrap);
router.route('/runipscrap').post(runIpScrap);
router.route('/getokresults').get(getAll);
router.route('/getbadresults').get(getbadresults);
router.route('/runpremiumproxyscrap').post(runPremiumProxyScrap);
router.route('/bandwidth').get(bandwidth);

module.exports = router;
