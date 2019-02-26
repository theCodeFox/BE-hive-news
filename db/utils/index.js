// output { article_id: users.username }
exports.createArticleAuthorRef = (users) => {
  const userRef = users.reduce((acc, val) => ({ [val.article_id]: val.author, ...acc }), {});
  return userRef;
};

// output { comment_id: users.username }
exports.createCommentAuthorRef = (users) => {
  const userRef = users.reduce((acc, val) => ({ [val.comment_id]: val.author, ...acc }), {});
  return userRef;
};

// output { article_id: topics.slug }
exports.createTopicRef = (topics) => {
  const topicRef = topics.reduce((acc, val) => ({ [val.article_id]: val.slug, ...acc }), {});
  return topicRef;
};

// output { comments.title: articles.article_id }
exports.createArticleRef = (articles) => {
  const topicRef = articles.reduce((acc, val) => ({
    [val.title]: val.article_id, ...acc,
  }), {});
  return topicRef;
};

// links articles with users and topics
exports.formatArticles = (articleData, authorRef, topicRef) => {
  const formattedArticles = articleData.reduce((acc, val) => {
    acc.push({
      title: val.title,
      topic: topicRef[val.article_id],
      author: authorRef[val.article_id],
      body: val.body,
      created_at: new Date(val.created_at),
      votes: val.votes,
      article_id: val.article_id,
    });
    return acc;
  }, []);
  return formattedArticles;
};

// links comments with articles and users
exports.formatComments = (commentData, usersRef, articlesRef) => {
  const formattedComments = commentData.reduce((acc, val) => {
    acc.push({
      comment_id: val.comment_id,
      author: usersRef[val.comment_id],
      article_id: articlesRef[val.belong_to],
      votes: val.votes,
      created_at: new Date(val.created_at),
      body: val.body,
    });
    return acc;
  }, []);
  return formattedComments;
};
