const { incrementVotes, removeComment } = require('../models/comments.js');

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes = 0 } = req.body;
  incrementVotes(comment_id, inc_votes)
    .then(([comment]) => res.status(200).send({ comment }))
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then((commentDeleted) => {
      if (commentDeleted === 1) res.sendStatus(204);
      else res.status(404).send({ status: 404, msg: 'Sorry, comment not found...' });
    })
    .catch(next);
};
