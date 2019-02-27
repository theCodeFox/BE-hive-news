const connection = require('../db/connection.js');

exports.incrementVotes = (id, votes) => connection('comments')
  .select('*')
  .where('comment_id', id)
  .increment('votes', votes)
  .returning('*');
