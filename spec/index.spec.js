const { expect } = require('chai');
const {
  createArticleAuthorRef,
  createTopicRef,
  formatArticles,
  formatComments,
  createArticleRef,
  createCommentAuthorRef,
} = require('../db/utils/index.js');

describe('createArticleAuthorRef', () => {
  it('returns object', () => {
    expect(createArticleAuthorRef([{}])).to.be.an('object');
  });
  it('returns object with key of author', () => {
    const input = [{ author: 'a', article_id: 'b' }];
    expect(createArticleAuthorRef(input)).to.eql({ b: 'a' });
  });
  it('returns object with key of author and value of article_id', () => {
    const input = [{ author: 'a', article_id: 1 }];
    expect(createArticleAuthorRef(input)).to.eql({ 1: 'a' });
  });
  it('returns object with key of author and value of article_id', () => {
    const input = [{ author: 'a', article_id: 1 }, { author: 'b', article_id: 2 }];
    expect(createArticleAuthorRef(input)).to.eql({ 1: 'a', 2: 'b' });
  });
});

describe('createCommentAuthorRef', () => {
  it('returns object', () => {
    expect(createCommentAuthorRef([{}])).to.be.an('object');
  });
  it('returns object with key of author', () => {
    const input = [{ author: 'a', comment_id: 'b' }];
    expect(createCommentAuthorRef(input)).to.eql({ b: 'a' });
  });
  it('returns object with key of author and value of comment_id', () => {
    const input = [{ author: 'a', comment_id: 1 }];
    expect(createCommentAuthorRef(input)).to.eql({ 1: 'a' });
  });
  it('returns object with key of author and value of comment_id', () => {
    const input = [{ author: 'a', comment_id: 1 }, { author: 'b', comment_id: 2 }];
    expect(createCommentAuthorRef(input)).to.eql({ 1: 'a', 2: 'b' });
  });
});

describe('createTopicRef', () => {
  it('returns object', () => {
    expect(createTopicRef([{}])).to.be.an('object');
  });
  it('returns object with key of slug', () => {
    const input = [{ slug: 'a', article_id: 'b' }];
    expect(createTopicRef(input)).to.eql({ b: 'a' });
  });
  it('returns object with key of slug and value of article_id', () => {
    const input = [{ slug: 'a', article_id: 1 }];
    expect(createTopicRef(input)).to.eql({ 1: 'a' });
  });
  it('returns object with key of slug and value of article_id', () => {
    const input = [{ slug: 'a', article_id: 1 }, { slug: 'b', article_id: 2 }];
    expect(createTopicRef(input)).to.eql({ 1: 'a', 2: 'b' });
  });
});

describe('createArticleRef', () => {
  it('returns object', () => {
    expect(createArticleRef([{}])).to.be.an('object');
  });
  it('returns object with key of article title', () => {
    const input = [{ title: 'a', article_id: 'b' }];
    expect(createArticleRef(input)).to.eql({ a: 'b' });
  });
  it('returns object with key of article title and value of article_id', () => {
    const input = [{ title: 'a', article_id: 1 }];
    expect(createArticleRef(input)).to.eql({ a: 1 });
  });
  it('returns object with key of article title and value of article_id', () => {
    const input = [{ title: 'a', article_id: 1 }, { title: 'b', article_id: 2 }];
    expect(createArticleRef(input)).to.eql({ a: 1, b: 2 });
  });
});

describe('formatArticles', () => {
  it('returns an array', () => {
    expect(formatArticles([], [], [])).to.be.an('array');
  });
  it('returns object with keys title, topic, author, body, created_at, votes, article_id', () => {
    const input1 = [{
      title: 'a', topic: 'b', author: 'c', body: 'd', created_at: 'e', votes: 'f', article_id: 1,
    }];
    const input2 = [{ author: 'a', article_id: 1 }];
    const input3 = [{ slug: 'a', article_id: 1 }];
    expect(formatArticles(input1, input2, input3)[0]).to.have.all.keys('title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_id');
  });
  it('created_at value is an instance of date/time', () => {
    const input1 = [{
      title: 'a', topic: 'b', author: 'c', body: 'd', created_at: 1542284514171, votes: 'e', article_id: 1,
    }];
    const input2 = { author: 'a', article_id: 1 };
    const input3 = { slug: 'a', article_id: 1 };
    expect(formatArticles(input1, input2, input3)[0].created_at).to.be.instanceOf(Date);
  });
});

describe('formatComments', () => {
  it('GET:200 returns array', () => {
    expect(formatComments([], [], [])).to.be.an('array');
  });
  it('GET:200 returns array with keys comment_id, author, article_id, votes, created_at, body', () => {
    const input1 = [{
      comment_id: 1, author: 2, article_id: 3, votes: 4, created_at: 5, body: 6, belong_to: 1,
    }];
    const input2 = [{ 1: 'a' }];
    const input3 = [{ a: 1 }];
    expect(formatComments(input1, input2, input3)).to.be.an('array');
    expect(formatComments(input1, input2, input3)[0]).to.have.all.keys(
      'comment_id',
      'author',
      'article_id',
      'votes',
      'created_at',
      'body',
    );
    expect(formatComments(input1, input2, input3)[0].created_at).to.be.an.instanceOf(Date);
  });
});
