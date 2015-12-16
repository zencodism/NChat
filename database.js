var Sequelize = require('sequelize');
var sequelize = new Sequelize('', '', '', {
    dialect: 'sqlite',
    storage: 'db.sqlite3',
    logging: false
});

var Message = sequelize.define('Message', {
      user: Sequelize.STRING(24),
      time: Sequelize.DATE,
      text: Sequelize.STRING(255)
});

module.exports = Message;

