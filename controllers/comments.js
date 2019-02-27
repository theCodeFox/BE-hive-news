const { incrementVotes, removeComment } = require('../models/comments.js');

exports.patchComment = (req, res, next) => {
  const id = req.params.comment_id;
  const votes = req.body.inc_votes;
  incrementVotes(id, votes)
    .then(([comment]) => res.status(200).send({ comment }))
    .catch(err => next(err));
};

exports.deleteComment = (req, res, next) => {
  const id = req.params.comment_id;
  removeComment(id)
    .then((commentDeleted) => {
      if (commentDeleted === 1) res.sendStatus(204);
      else res.status(404).send({ status: 404, msg: 'Sorry, comment not found...' });
    })
    .catch(err => next(err));
};
