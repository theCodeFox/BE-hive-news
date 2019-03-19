const connection = require('../db/connection.js');

exports.fetchUsers = () => connection('users').select('*');

exports.addUser = user => connection('users').insert(user).returning('*');

exports.fetchUserByUsername = username => connection('users').select('*').where('username', username);

exports.fetchCommentsByUsername = username => connection('comments').select('*').where('author', username);
