// output { article_id: users.username }
exports.createAuthorRef = (users) => {
  const userRef = users.reduce((acc, val) => ({ [val.article_id]: val.author, ...acc }), {});
  return userRef;
};

// output { article_id: topics.slug }
exports.createTopicRef = (topics) => {
  const topicRef = topics.reduce((acc, val) => ({ [val.article_id]: val.slug, ...acc }), {});
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
      created_at: val.created_at,
      votes: val.votes,
      article_id: val.article_id,
    });
    return acc;
  }, []);
  return formattedArticles;
};
