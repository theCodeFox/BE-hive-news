const {
  fetchUsers,
  addUser,
  fetchUserByUsername,
  fetchCommentsByUsername,
} = require('../models/users.js');

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const user = req.body;
  addUser(user)
    .then(([newUser]) => {
      res.status(201).send({ user: newUser });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(([user]) => {
      if (!user) res.status(404).send({ status: 404, msg: 'Sorry, User Not Found' });
      else res.status(200).send({ user });
    })
    .catch(next);
};

exports.getCommentsByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchCommentsByUsername(username)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
