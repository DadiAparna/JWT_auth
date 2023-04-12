require('dotenv').config();

module.exports = {
  dbUrl: process.env.db_url,
  dbOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};
