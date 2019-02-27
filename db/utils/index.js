exports.createArticleRef = (articles) => {
  const topicRef = articles.reduce((acc, val) => ({
    [val.title]: val.article_id, ...acc,
  }), {});
  return topicRef;
};

exports.formatArticles = (articleData) => {
  const formattedArticles = articleData.reduce((acc, val) => {
    acc.push({
      title: val.title,
      topic: val.topic,
      author: val.author,
      body: val.body,
      created_at: new Date(val.created_at),
      votes: val.votes,
      article_id: val.article_id,
    });
    return acc;
  }, []);
  return formattedArticles;
};

exports.formatComments = (commentData, articlesRef) => {
  const formattedComments = commentData.reduce((acc, val) => {
    acc.push({
      comment_id: val.comment_id,
      author: val.created_by,
      article_id: articlesRef[val.belongs_to],
      votes: val.votes,
      created_at: new Date(val.created_at),
      body: val.body,
    });
    return acc;
  }, []);
  return formattedComments;
};
