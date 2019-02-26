const connection = require('../db/connection.js');

exports.fetchTopics = () => connection('topics').select('*');

exports.addTopic = topic => connection('topics').insert(topic);
