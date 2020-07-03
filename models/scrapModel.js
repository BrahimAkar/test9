const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then()
  .catch(err => console.log('mongoDB ERROR Is:', err));

const scrapSchema = new mongoose.Schema({
  Success: {
    type: Boolean
  },
  Message: {
    type: String
  },
  PageTitle: {
    type: String,

    default: ''
  },
  PageLink: {
    type: String
  },
  screenPath: {
    type: String
  },
  dateTime: {
    type: String
  },
  proxy: {
    type: String
  }
});

const scrapMod = mongoose.model('Scrap', scrapSchema);

module.exports = scrapMod;
