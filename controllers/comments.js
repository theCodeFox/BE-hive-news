const { incrementVotes, removeComment } = require('../models/comments.js');

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  let { inc_votes = 0 } = req.body;
  if (typeof inc_votes !== 'number') inc_votes = 0;
  incrementVotes(comment_id, inc_votes)
    .then(([comment]) => {
      if (!comment) res.status(404).send({ status: 404, msg: 'Sorry, Not Found' });
      else res.status(200).send({ comment });
    })
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
