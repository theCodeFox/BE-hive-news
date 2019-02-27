const { incrementVotes } = require('../models/comments.js');

exports.patchComment = (req, res, next) => {
  const id = req.params.comment_id;
  const votes = req.body.inc_votes;
  incrementVotes(id, votes)
    .then(([comment]) => res.status(200).send({ comment }))
    .catch(err => next(err));
};
