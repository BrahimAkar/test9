const mongoose = require('mongoose');

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

const errorsSchema = new mongoose.Schema({
  Success: {
    type: Boolean
  },
  Message: {
    type: String
  },
  dateTime: {
    type: String
  },
  proxy: {
    type: String
  }
});

const errorsMod = mongoose.model('Errors', errorsSchema);

module.exports = errorsMod;
