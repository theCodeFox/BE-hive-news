const connection = require('../db/connection.js');

exports.getTopics = () => connection('topics').select('*');
