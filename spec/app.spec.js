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
      it('INVALID METHOD:405', () => request
        .patch('/api/topics')
        .expect(405)
        .then((res) => {
          expect(res.body.msg).to.equal('Method Not Allowed!');
        }));
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
          expect(res.body.msg).to.equal('Sorry, not found...');
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
            expect(res.body.topic).to.have.keys(
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
      it('ERR:422 if topic slug exists', () => {
        const input = {
          slug: 'cats',
          description: 'Mr.Tiddles',
        };
        return request
          .post('/api/topics')
          .send(input)
          .expect(422)
          .then((res) => {
            expect(res.body.msg).to.equal('Unprocessable Entity - Input Incorrect');
          });
      });
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
          expect(res.body.articles[0].created_at).to.equal('2018-11-15T12:21:54.171Z');
        }));
      it('GET:200 uses query sort_by to sort articles by column name - author', () => request
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].author).to.equal('rogersop');
        }));
      it('GET:200 can take multiple queries', () => request
        .get('/api/articles?author=rogersop&topic=cats')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].author).to.equal('rogersop');
          expect(res.body.articles[0].topic).to.equal('cats');
        }));
      it('ERR:400 if blank query given', () => request
        .get('/api/articles?sort_by')
        .expect(400)
        .then((res) => {
          expect(res.body.msg).to.equal('Please fill all required fields');
        }));
      it('GET:200 uses query sort_by to sort articles by column name and can change order from desc to asc', () => request
        .get('/api/articles?sort_by=author&order=asc')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].author).to.equal('butter_bridge');
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
      it('GET:200 takes query of p so user can pick which page they would like to view - default 1', () => request
        .get('/api/articles?limit=5&p=1')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.lengthOf(5);
          expect(res.body.articles[4].article_id).to.equal(5);
        }));
      it('GET:200 takes query of p so user can pick which page they would like to view', () => request
        .get('/api/articles?limit=5&p=2')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.lengthOf(5);
          expect(res.body.articles[4].article_id).to.equal(10);
        }));
      it('GET:200 returns amount of articles', () => request
        .get('/api/articles')
        .expect(200)
        .then((res) => {
          expect(res.body.total_articles).to.equal(12);
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
            expect(res.body.article).to.have.all.keys(
              'title', 'body', 'author', 'topic', 'article_id', 'votes', 'created_at',
            );
          });
      });
      describe('/:article_id', () => {
        it('GET:200 returns article by article_id', () => request
          .get('/api/articles/1')
          .expect(200)
          .then((res) => {
            expect(res.body.article.article_id).to.equal(1);
          }));
        it('ERR:404 if article id doesnt exist', () => request
          .get('/api/articles/100')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).to.equal('Sorry, Not Found');
          }));
        it('PATCH:200 updates positive votes using obj with inc_votes key', () => {
          const updateVotes = { inc_votes: 1 };
          return request
            .patch('/api/articles/1')
            .send(updateVotes)
            .expect(200)
            .then((res) => {
              expect(res.body.article.votes).to.equal(101);
            });
        });
        it('PATCH:200 updates negative votes using obj with inc_votes key', () => {
          const updateVotes = { inc_votes: -1 };
          return request
            .patch('/api/articles/1')
            .send(updateVotes)
            .expect(200)
            .then((res) => {
              expect(res.body.article.votes).to.equal(99);
            });
        });
        it('PATCH:200 updates negative votes using obj with inc_votes key if votes go below 0', () => {
          const updateVotes = { inc_votes: -101 };
          return request
            .patch('/api/articles/1')
            .send(updateVotes)
            .expect(200)
            .then((res) => {
              expect(res.body.article.votes).to.equal(-1);
            });
        });
        it('DELETE:204 deletes article by article id', () => request
          .delete('/api/articles/1')
          .expect(204));
        it('ERR:404', () => request
          .delete('/api/articles/100')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).to.equal('Sorry, article not found...');
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
            expect(res.body.comments[0].created_at).to.equal('2016-11-22T12:36:03.389Z');
          }));
        it('GET:200 uses query sort_by to sort comments by column name - author', () => request
          .get('/api/articles/1/comments?sort_by=author')
          .expect(200)
          .then((res) => {
            expect(res.body.comments[0].author).to.equal('icellusedkars');
          }));
        it('ERR:400 if blank query given', () => request
          .get('/api/articles/1/comments?sort_by')
          .expect(400)
          .then((res) => {
            expect(res.body.msg).to.equal('Please fill all required fields');
          }));
        it('GET:200 uses query sort_by to sort comments by column name and can change order from desc to asc', () => request
          .get('/api/articles/1/comments?sort_by=author&order=asc')
          .expect(200)
          .then((res) => {
            expect(res.body.comments[0].author).to.equal('butter_bridge');
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
        it('GET:200 takes query of p so user can pick which page they would like to view - default 1', () => request
          .get('/api/articles/1/comments?limit=5&p=1')
          .expect(200)
          .then((res) => {
            expect(res.body.comments).to.have.lengthOf(5);
            expect(res.body.comments[4].comment_id).to.equal(6);
          }));
        it('GET:200 takes query of p so user can pick which page they would like to view', () => request
          .get('/api/articles/1/comments?limit=5&p=2')
          .expect(200)
          .then((res) => {
            expect(res.body.comments).to.have.lengthOf(5);
            expect(res.body.comments[4].comment_id).to.equal(11);
          }));
        it.only('GET:200 returns amount of comments', () => request
          .get('/api/articles/1/comments')
          .expect(200)
          .then((res) => {
            expect(res.body.total_comments).to.equal(18);
          }));
        it('POST:201 given username & body - returns new comment', () => {
          const input = { author: 'rogersop', body: 'a' };
          return request
            .post('/api/articles/1/comments')
            .send(input)
            .expect(201)
            .then((res) => {
              expect(res.body.comment).to.have.keys(
                'article_id', 'comment_id', 'votes', 'created_at', 'author', 'body',
              );
            });
        });
      });
    });
    describe('/comments', () => {
      it('PATCH:200 returns updated comment with new vote tally using comment id', () => {
        const input = ({ inc_votes: 1 });
        return request
          .patch('/api/comments/1')
          .send(input)
          .expect(200)
          .then((res) => {
            expect(res.body.comment.votes).to.equal(17);
          });
      });
      it('DELETE:204', () => request
        .delete('/api/comments/1')
        .expect(204));
      it('ERR:404 if comment id doesnt exist', () => request
        .delete('/api/comments/100')
        .expect(404)
        .then(res => expect(res.body.msg).to.equal('Sorry, comment not found...')));
    });
    describe('/users', () => {
      it('GET:200 returns array of user objects', () => request
        .get('/api/users')
        .expect(200)
        .then((res) => {
          expect(res.body.users).to.be.an('array');
          expect(res.body.users[0]).to.have.keys(
            'username', 'avatar_url', 'name',
          );
        }));
      it('POST:201 returns object of new user', () => {
        const input = { username: 'a', avatar_url: 'test', name: 'a' };
        return request
          .post('/api/users')
          .send(input)
          .expect(201)
          .then(res => expect(res.body.user.username).to.equal('a'));
      });
      describe('/:username', () => {
        it('GET:200 returns user object by username', () => request
          .get('/api/users/rogersop')
          .expect(200)
          .then(res => expect(res.body.user.username).to.equal('rogersop')));
      });
    });
  });
});
