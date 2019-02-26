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
            expect(res.body.topic).to.be.an('object');
            expect(res.body.topic).to.eql(topic);
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
    });
  });
});
