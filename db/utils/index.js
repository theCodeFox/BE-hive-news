// output { articles.author:article_id }
exports.createAuthorRef = (users) => {
  return users.reduce((acc, val) => ({ [val.article_id]: val.author, ...acc }), {});
};
