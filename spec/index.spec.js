const { expect } = require('chai');
const { createAuthorRef, createTopicRef } = require('../db/utils/index.js');

describe('createAuthorRef', () => {
  it('returns array', () => {
    expect(createAuthorRef([{}])).to.be.an('object');
  });
  it('returns object in array with key of author', () => {
    const input = [{ author: 'a', article_id: 'b' }];
    expect(createAuthorRef(input)).to.eql({ b: 'a' });
  });
  it('returns object in array with key of author and value of article_id', () => {
    const input = [{ author: 'a', article_id: 1 }];
    expect(createAuthorRef(input)).to.eql({ 1: 'a' });
  });
  it('returns object in array with key of author and value of article_id', () => {
    const input = [{ author: 'a', article_id: 1 }, { author: 'b', article_id: 2 }];
    expect(createAuthorRef(input)).to.eql({ 1: 'a', 2: 'b' });
  });
});

describe('createTopicRef', () => {
  it('returns array', () => {
    expect(createTopicRef([{}])).to.be.an('object');
  });
  it('returns object in array with key of slug', () => {
    const input = [{ slug: 'a', article_id: 'b' }];
    expect(createTopicRef(input)).to.eql({ b: 'a' });
  });
  it('returns object in array with key of slug and value of article_id', () => {
    const input = [{ slug: 'a', article_id: 1 }];
    expect(createTopicRef(input)).to.eql({ 1: 'a' });
  });
  it('returns object in array with key of slug and value of article_id', () => {
    const input = [{ slug: 'a', article_id: 1 }, { slug: 'b', article_id: 2 }];
    expect(createTopicRef(input)).to.eql({ 1: 'a', 2: 'b' });
  });
});
