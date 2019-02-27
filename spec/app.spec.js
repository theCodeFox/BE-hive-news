process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');
const connection = require('../db/connection.js');
const app = require('../app.js');

const request = supertest(app);

describe('/', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe('/api', () => {
    describe('/topics', () => {
      it('GET:200 returns array of topic objects', () => request
        .get('/api/topics')
        .expect(200)
        .then((res) => {
          expect(res.body.topics).to.be.an('array');
          expect(res.body.topics[0]).to.have.keys(
            'slug', 'description',
          );
        }));
      it('ERR:404 if incorrect path used', () => request
        .get('/api/topic')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('Sorry, page not found...');
        }));
      it('POST:201 returns posted topic object', () => {
        const topic = {
          slug: 'a',
          description: 'b',
        };
        return request
          .post('/api/topics')
          .send(topic)
          .expect(201)
          .then((res) => {
            expect(res.body.topic[0]).to.have.keys(
              'slug', 'description',
            );
          });
      });
      it('ERR:400 if topic doesnt have slug', () => request
        .post('/api/topics')
        .send({})
        .expect(400)
        .then((res) => {
          expect(res.body.msg).to.equal('Please fill all required fields');
        }));
    });
    describe('/articles', () => {
      it('GET:200 returns array of article objs', () => request
        .get('/api/articles')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles[0]).to.have.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count');
        }));
      it('GET:200 filters by author on query', () => request
        .get('/api/articles?author=rogersop')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].author).to.equal('rogersop');
        }));
      it('GET:200 filters by topic on query', () => request
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].topic).to.equal('mitch');
        }));
      it('GET:200 uses query sort_by to sort articles by column name - default date ', () => request
        .get('/api/articles')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].created_at).to.equal('1974-11-26T12:21:54.171Z');
        }));
      it('GET:200 uses query sort_by to sort articles by column name - author', () => request
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].author).to.equal('butter_bridge');
        }));
      it('ERR:400 if blank query given', () => request
        .get('/api/articles?sort_by')
        .expect(400)
        .then((res) => {
          expect(res.body.msg).to.equal('Please fill all required fields');
        }));
      it('GET:200 uses query sort_by to sort articles by column name and can change order from asc to desc', () => request
        .get('/api/articles?sort_by=author&order=desc')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].author).to.equal('rogersop');
        }));
      it('GET:200 returns limit of replies - default 10', () => request
        .get('/api/articles')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.lengthOf(10);
        }));
      it('GET:200 returns limit of replies', () => request
        .get('/api/articles?limit=5')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.lengthOf(5);
        }));
      it('POST:201 returns inserted obj with title, body, topic, author', () => {
        const article = {
          title: 'a',
          body: 'a',
          topic: 'cats',
          author: 'rogersop',
        };
        return request
          .post('/api/articles')
          .send(article)
          .expect(201)
          .then((res) => {
            expect(res.body.article[0]).to.have.all.keys(
              'title', 'body', 'author', 'topic', 'article_id', 'votes', 'created_at',
            );
          });
      });
      describe('/:article_id', () => {
        it('GET:200 returns article by article_id', () => request
          .get('/api/articles/1')
          .expect(200)
          .then((res) => {
            expect(res.body.article[0].article_id).to.equal(1);
          }));
        it('PATCH:200 updates positive votes using obj with int_votes key', () => {
          const updateVotes = { int_votes: 1 };
          return request
            .patch('/api/articles/1')
            .send(updateVotes)
            .expect(200)
            .then((res) => {
              expect(res.body.article[0].votes).to.equal(101);
            });
        });
        it('PATCH:200 updates negative votes using obj with int_votes key', () => {
          const updateVotes = { int_votes: -1 };
          return request
            .patch('/api/articles/1')
            .send(updateVotes)
            .expect(200)
            .then((res) => {
              expect(res.body.article[0].votes).to.equal(99);
            });
        });
        it('PATCH:200 updates negative votes using obj with int_votes key if votes go below 0', () => {
          const updateVotes = { int_votes: -101 };
          return request
            .patch('/api/articles/1')
            .send(updateVotes)
            .expect(200)
            .then((res) => {
              expect(res.body.article[0].votes).to.equal(-1);
            });
        });
        it('DELETE:204 deletes article by article id', () => request
          .delete('/api/articles/1')
          .expect(204));
        it('ERR:404', () => request
          .delete('/api/articles/100')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).to.equal('Sorry, page not found...');
          }));
        it('GET:200 returns comments array for article using article id', () => request
          .get('/api/articles/1/comments')
          .expect(200)
          .then((res) => {
            expect(res.body.comments).to.be.an('array');
            expect(res.body.comments[0]).to.have.keys(
              'comment_id', 'votes', 'created_at', 'author', 'body',
            );
          }));
        it('GET:200 uses query sort_by to sort comments by column name - default date ', () => request
          .get('/api/articles/1/comments')
          .expect(200)
          .then((res) => {
            expect(res.body.comments[0].created_at).to.equal('2000-11-26T12:36:03.389Z');
          }));
        it('GET:200 uses query sort_by to sort comments by column name - author', () => request
          .get('/api/articles/1/comments?sort_by=author')
          .expect(200)
          .then((res) => {
            expect(res.body.comments[0].author).to.equal('butter_bridge');
          }));
        it('ERR:400 if blank query given', () => request
          .get('/api/articles/1/comments?sort_by')
          .expect(400)
          .then((res) => {
            expect(res.body.msg).to.equal('Please fill all required fields');
          }));
        it('GET:200 uses query sort_by to sort comments by column name and can change order from asc to desc', () => request
          .get('/api/articles/1/comments?sort_by=author&order=desc')
          .expect(200)
          .then((res) => {
            expect(res.body.comments[0].author).to.equal('icellusedkars');
          }));
        it('GET:200 returns limit of replies - default 10', () => request
          .get('/api/articles/1/comments')
          .expect(200)
          .then((res) => {
            expect(res.body.comments).to.have.lengthOf(10);
          }));
        it('GET:200 returns limit of replies', () => request
          .get('/api/articles/1/comments?limit=5')
          .expect(200)
          .then((res) => {
            expect(res.body.comments).to.have.lengthOf(5);
          }));
      });
    });
  });
});
