// output { article_id: users.username }
exports.createAuthorRef = (users) => {
  return users.reduce((acc, val) => ({ [val.article_id]: val.author, ...acc }), {});
};

// output { article_id: topics.slug }
exports.createTopicRef = (topics) => {
  return topics.reduce((acc, val) => ({ [val.article_id]: val.slug, ...acc }), {});
};
