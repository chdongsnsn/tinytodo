const mongoose = require('mongoose');

const DB_URL = 'mongodb://127.0.0.1:27017/todolist'; // MongoDB 数据库地址

module.exports = {
  async connectDB() {
    mongoose.Promise = global.Promise;
    return mongoose.connect(DB_URL, { useMongoClient: true });
  },
};

const dbConnection = mongoose.connection;

dbConnection.once('open', () => {
  console.log(`Connected to ${DB_URL}`);
});

dbConnection.on('error', (err) => {
  console.log(`Connecting Error: ${err}`);
});
