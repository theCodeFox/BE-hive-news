const connection = require('../db/connection.js');

exports.fetchUsers = () => connection('users').select('*');

exports.addUser = user => connection('users').insert(user).returning('*');
