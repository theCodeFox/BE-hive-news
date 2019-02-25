const { expect } = require('chai');
const { createAuthorRef, createTopicRef, formatArticles } = require('../db/utils/index.js');

describe('createAuthorRef', () => {
  it('returns object', () => {
    expect(createAuthorRef([{}])).to.be.an('object');
  });
  it('returns object with key of author', () => {
    const input = [{ author: 'a', article_id: 'b' }];
    expect(createAuthorRef(input)).to.eql({ b: 'a' });
  });
  it('returns object with key of author and value of article_id', () => {
    const input = [{ author: 'a', article_id: 1 }];
    expect(createAuthorRef(input)).to.eql({ 1: 'a' });
  });
  it('returns object with key of author and value of article_id', () => {
    const input = [{ author: 'a', article_id: 1 }, { author: 'b', article_id: 2 }];
    expect(createAuthorRef(input)).to.eql({ 1: 'a', 2: 'b' });
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
    expect(formatArticles(input1, input2, input3)[0]).to.have.keys('title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_id');
  });
});
